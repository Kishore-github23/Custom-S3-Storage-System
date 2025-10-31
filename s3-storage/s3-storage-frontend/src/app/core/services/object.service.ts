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
}