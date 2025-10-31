import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ObjectService } from '../../../core/services/object.service';
import { StorageObject } from '../../../core/models/object.model';
import { ObjectUploadComponent } from '../object-upload/object-upload';

@Component({
  selector: 'app-object-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './object-list.html',
  styleUrls: ['./object-list.css']
})
export class ObjectList implements OnInit {
  bucketName = '';
  objects: StorageObject[] = [];
  loading = false;
  displayedColumns: string[] = ['key', 'size', 'contentType', 'createdAt', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private objectService: ObjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.bucketName = this.route.snapshot.paramMap.get('bucketName') || '';
    this.loadObjects();
  }

  loadObjects(): void {
    this.loading = true;
    this.objectService.listObjects(this.bucketName).subscribe({
      next: (objects) => {
        this.objects = objects;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to load objects', 'Close', { duration: 3000 });
      }
    });
  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(ObjectUploadComponent, {
      width: '500px',
      data: { bucketName: this.bucketName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadObjects();
      }
    });
  }

  downloadObject(object: StorageObject): void {
    this.objectService.downloadObject(this.bucketName, object.key).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = object.key;
        link.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Download started', 'Close', { duration: 2000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to download object', 'Close', { duration: 3000 });
      }
    });
  }

  deleteObject(object: StorageObject): void {
    if (confirm(`Are you sure you want to delete "${object.key}"?`)) {
      this.objectService.deleteObject(this.bucketName, object.key).subscribe({
        next: () => {
          this.snackBar.open('Object deleted successfully', 'Close', { duration: 3000 });
          this.loadObjects();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete object', 'Close', { duration: 3000 });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/buckets']);
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}