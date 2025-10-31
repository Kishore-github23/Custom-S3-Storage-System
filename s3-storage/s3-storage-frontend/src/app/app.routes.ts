import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LayoutComponent } from './shared/layout/layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/buckets',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'buckets',
        loadChildren: () => import('./features/buckets/buckets.routes').then(m => m.BUCKET_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/buckets'
  }
];