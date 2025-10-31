export interface Bucket {
  id: number;
  name: string;
  isPublic: boolean;
  objectCount: number;
  createdAt: string;
}

export interface CreateBucketRequest {
  name: string;
  isPublic: boolean;
}