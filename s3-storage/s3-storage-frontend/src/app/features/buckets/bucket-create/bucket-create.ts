import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BucketService } from '../../../core/services/bucket.service';

@Component({
  selector: 'app-bucket-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './bucket-create.html',
  styleUrls: ['./bucket-create.css']
})
export class BucketCreateComponent {
  bucketForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private bucketService: BucketService,
    private dialogRef: MatDialogRef<BucketCreateComponent>,
    private snackBar: MatSnackBar
  ) {
    this.bucketForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(63),
        Validators.pattern(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/)
      ]],
      isPublic: [false]
    });
  }

  onSubmit(): void {
    if (this.bucketForm.valid) {
      this.loading = true;

      this.bucketService.createBucket(this.bucketForm.value).subscribe({
        next: () => {
          this.snackBar.open('Bucket created successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(error.error?.message || 'Failed to create bucket', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}