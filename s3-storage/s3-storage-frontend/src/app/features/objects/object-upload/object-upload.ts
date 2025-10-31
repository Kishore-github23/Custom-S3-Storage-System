import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType } from '@angular/common/http';
import { ObjectService } from '../../../core/services/object.service';

@Component({
  selector: 'app-object-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule
  ],
  templateUrl: './object-upload.html',
  styleUrls: ['./object-upload.css']
})
export class ObjectUploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploading = false;
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private objectService: ObjectService,
    private dialogRef: MatDialogRef<ObjectUploadComponent>,
    private snackBar: MatSnackBar
  ) {
    this.data = inject(MAT_DIALOG_DATA);
    this.uploadForm = this.fb.group({
      objectKey: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  public data: { bucketName: string };

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      if (!this.uploadForm.get('objectKey')?.value) {
        this.uploadForm.patchValue({ objectKey: file.name });
      }
      this.uploadForm.patchValue({ file: file });
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      this.uploading = true;
      const objectKey = this.uploadForm.get('objectKey')?.value;

      this.objectService.uploadObject(this.data.bucketName, objectKey, this.selectedFile)
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              if (event.total) {
                this.uploadProgress = Math.round(100 * event.loaded / event.total);
              }
            } else if (event.type === HttpEventType.Response) {
              this.snackBar.open('File uploaded successfully', 'Close', { duration: 3000 });
              this.dialogRef.close(true);
            }
          },
          error: (error) => {
            this.uploading = false;
            this.uploadProgress = 0;
            this.snackBar.open('Failed to upload file', 'Close', { duration: 3000 });
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}