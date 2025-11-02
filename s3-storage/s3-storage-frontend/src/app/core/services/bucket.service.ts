import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bucket, CreateBucketRequest } from '../models/bucket.model';

@Injectable({
  providedIn: 'root'
})
export class BucketService {
  private apiUrl = `${environment.apiUrl}/buckets`;

  constructor(private http: HttpClient) {}

  createBucket(request: CreateBucketRequest): Observable<Bucket> {
    return this.http.post<Bucket>(this.apiUrl, request);
  }

  listBuckets(): Observable<Bucket[]> {
    return this.http.get<Bucket[]>(this.apiUrl);
  }

  getBucket(name: string): Observable<Bucket> {
    return this.http.get<Bucket>(`${this.apiUrl}/${name}`);
  }

  deleteBucket(name: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${name}`);
  }

  updateVisibility(name: string, isPublic: boolean): Observable<Bucket> {
    return this.http.patch<Bucket>(`${this.apiUrl}/${name}`, { isPublic });
  }

  // Helper method to check if bucket name is valid
  validateBucketName(name: string): { valid: boolean; error?: string } {
    if (!name) {
      return { valid: false, error: 'Bucket name is required' };
    }
    
    if (name.length < 3) {
      return { valid: false, error: 'Bucket name must be at least 3 characters' };
    }
    
    if (name.length > 63) {
      return { valid: false, error: 'Bucket name must not exceed 63 characters' };
    }
    
    const bucketNameRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (!bucketNameRegex.test(name)) {
      return { 
        valid: false, 
        error: 'Bucket name must start and end with a lowercase letter or number, and contain only lowercase letters, numbers, and hyphens' 
      };
    }
    
    return { valid: true };
  }
}