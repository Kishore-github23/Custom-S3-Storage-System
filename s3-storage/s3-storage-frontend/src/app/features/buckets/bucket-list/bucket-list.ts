import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BucketService } from '../../../core/services/bucket.service';
import { Bucket } from '../../../core/models/bucket.model';
import { BucketCreateComponent } from '../bucket-create/bucket-create';

@Component({
  selector: 'app-bucket-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './bucket-list.html',
  styleUrls: ['./bucket-list.css']
})
export class BucketListComponent implements OnInit {
  buckets: Bucket[] = [];
  loading = false;

  constructor(
    private bucketService: BucketService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBuckets();
  }

  loadBuckets(): void {
    this.loading = true;
    this.bucketService.listBuckets().subscribe({
      next: (buckets) => {
        this.buckets = buckets;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to load buckets', 'Close', { duration: 3000 });
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(BucketCreateComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBuckets();
      }
    });
  }

  viewBucket(bucket: Bucket): void {
    this.router.navigate(['/buckets', bucket.name, 'objects']);
  }

  deleteBucket(bucket: Bucket, event: Event): void {
    event.stopPropagation();
    
    if (confirm(`Are you sure you want to delete bucket "${bucket.name}"?`)) {
      this.bucketService.deleteBucket(bucket.name).subscribe({
        next: () => {
          this.snackBar.open('Bucket deleted successfully', 'Close', { duration: 3000 });
          this.loadBuckets();
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to delete bucket', 'Close', { duration: 3000 });
        }
      });
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}