import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageObject } from '../models/object.model';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {
  private apiUrl = `${environment.apiUrl}/buckets`;

  constructor(private http: HttpClient) {}

  uploadObject(bucketName: string, objectKey: string, file: File): Observable<HttpEvent<StorageObject>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', objectKey);

    const req = new HttpRequest('POST', 
      `${this.apiUrl}/${bucketName}/objects`, 
      formData,
      {
        reportProgress: true
      }
    );

    return this.http.request<StorageObject>(req);
  }

  listObjects(bucketName: string): Observable<StorageObject[]> {
    return this.http.get<StorageObject[]>(`${this.apiUrl}/${bucketName}/objects`);
  }

  getObjectMetadata(bucketName: string, objectKey: string): Observable<StorageObject> {
    return this.http.get<StorageObject>(`${this.apiUrl}/${bucketName}/objects/${objectKey}/metadata`);
  }

  downloadObject(bucketName: string, objectKey: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${bucketName}/objects/${objectKey}`, {
      responseType: 'blob'
    });
  }

  deleteObject(bucketName: string, objectKey: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bucketName}/objects/${objectKey}`);
  }

  // Helper method to get file extension
  getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  // Helper method to check if file type is allowed
  isAllowedFileType(file: File, allowedTypes?: string[]): boolean {
    if (!allowedTypes || allowedTypes.length === 0) {
      return true; // Allow all types if no restriction
    }
    
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        // Check category (e.g., 'image/*')
        const category = type.split('/')[0];
        return file.type.startsWith(category + '/');
      }
      return file.type === type;
    });
  }

  // Helper method to check file size
  isFileSizeValid(file: File, maxSizeInMB: number = 500): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  // Helper method to sanitize object key
  sanitizeObjectKey(key: string): string {
    // Remove leading/trailing whitespace
    key = key.trim();
    
    // Replace multiple slashes with single slash
    key = key.replace(/\/+/g, '/');
    
    // Remove leading slash
    if (key.startsWith('/')) {
      key = key.substring(1);
    }
    
    return key;
  }

  // Helper method to validate object key
  validateObjectKey(key: string): { valid: boolean; error?: string } {
    if (!key || key.trim().length === 0) {
      return { valid: false, error: 'Object key is required' };
    }
    
    if (key.length > 1024) {
      return { valid: false, error: 'Object key must not exceed 1024 characters' };
    }
    
    if (key.includes('//')) {
      return { valid: false, error: 'Object key cannot contain consecutive slashes' };
    }
    
    return { valid: true };
  }
}