import { Routes } from '@angular/router';
import { BucketListComponent } from './bucket-list/bucket-list';
import { ObjectList } from '../objects/object-list/object-list';

export const BUCKET_ROUTES: Routes = [
  {
    path: '',
    component: BucketListComponent
  },
  {
    path: ':bucketName/objects',
    component: ObjectList
  }
];