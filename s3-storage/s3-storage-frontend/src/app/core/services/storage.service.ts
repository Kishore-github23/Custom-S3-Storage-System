import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface StorageStats {
  totalBuckets: number;
  totalObjects: number;
  totalSize: number;
  usedStorage: number;
  maxStorage: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // Current bucket being viewed
  private currentBucketSubject = new BehaviorSubject<string | null>(null);
  public currentBucket$ = this.currentBucketSubject.asObservable();

  // Breadcrumbs for navigation
  private breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
  public breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  // Search query
  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();

  // Storage statistics (for Phase 2)
  private storageStatsSubject = new BehaviorSubject<StorageStats>({
    totalBuckets: 0,
    totalObjects: 0,
    totalSize: 0,
    usedStorage: 0,
    maxStorage: 10737418240 // 10 GB in bytes
  });
  public storageStats$ = this.storageStatsSubject.asObservable();

  constructor() {}

  // Current Bucket Management
  setCurrentBucket(bucketName: string | null): void {
    this.currentBucketSubject.next(bucketName);
  }

  getCurrentBucket(): string | null {
    return this.currentBucketSubject.value;
  }

  // Breadcrumb Management
  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void {
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  addBreadcrumb(breadcrumb: BreadcrumbItem): void {
    const current = this.breadcrumbsSubject.value;
    this.breadcrumbsSubject.next([...current, breadcrumb]);
  }

  clearBreadcrumbs(): void {
    this.breadcrumbsSubject.next([]);
  }

  // Search Management
  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  clearSearchQuery(): void {
    this.searchQuerySubject.next('');
  }

  // Storage Stats Management (for Phase 2)
  updateStorageStats(stats: Partial<StorageStats>): void {
    const current = this.storageStatsSubject.value;
    this.storageStatsSubject.next({ ...current, ...stats });
  }

  getStorageStats(): StorageStats {
    return this.storageStatsSubject.value;
  }

  // Utility Methods
  formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  getFileIcon(contentType: string | null): string {
    if (!contentType) return 'insert_drive_file';
    
    if (contentType.startsWith('image/')) return 'image';
    if (contentType.startsWith('video/')) return 'videocam';
    if (contentType.startsWith('audio/')) return 'audiotrack';
    if (contentType.includes('pdf')) return 'picture_as_pdf';
    if (contentType.includes('zip') || contentType.includes('compressed')) return 'folder_zip';
    if (contentType.includes('word') || contentType.includes('document')) return 'description';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'table_chart';
    if (contentType.includes('powerpoint') || contentType.includes('presentation')) return 'slideshow';
    if (contentType.includes('text')) return 'text_snippet';
    
    return 'insert_drive_file';
  }

  // Download file helper
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Validate bucket name
  isValidBucketName(name: string): boolean {
    if (!name || name.length < 3 || name.length > 63) {
      return false;
    }
    // Must start and end with lowercase letter or number
    // Can contain lowercase letters, numbers, and hyphens
    const bucketNameRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    return bucketNameRegex.test(name);
  }

  // Validate object key
  isValidObjectKey(key: string): boolean {
    if (!key || key.length === 0 || key.length > 1024) {
      return false;
    }
    // Check for invalid characters
    return !key.includes('//') && key.trim() === key;
  }

  // Calculate storage percentage
  getStoragePercentage(): number {
    const stats = this.storageStatsSubject.value;
    if (stats.maxStorage === 0) return 0;
    return Math.round((stats.usedStorage / stats.maxStorage) * 100);
  }

  // Get storage color based on usage
  getStorageColor(): string {
    const percentage = this.getStoragePercentage();
    if (percentage >= 90) return '#f44336'; // Red
    if (percentage >= 75) return '#ff9800'; // Orange
    if (percentage >= 50) return '#ffc107'; // Yellow
    return '#4caf50'; // Green
  }
}