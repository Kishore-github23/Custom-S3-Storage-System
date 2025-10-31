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
}