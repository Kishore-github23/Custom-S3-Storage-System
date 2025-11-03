import { Routes } from '@angular/router';
import { BucketList } from './bucket-list/bucket-list';
import { ObjectList } from '../objects/object-list/object-list';

export const BUCKET_ROUTES: Routes = [
  {
    path: '',
    component: BucketList
  },
  {
    path: ':bucketName/objects',
    component: ObjectList
  }
];