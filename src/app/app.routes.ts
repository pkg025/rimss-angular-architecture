import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/product-search/product-search.component')
        .then(m => m.ProductSearchComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component')
        .then(m => m.ProductDetailComponent)
  },
  {
    // Plugin route — loadComponent directly, no module wrapper needed in Angular 19
    path: 'plugin/offers',
    loadComponent: () =>
      import('./plugins/offers/offers.component')
        .then(m => m.OffersComponent),
  },
  { path: '**', redirectTo: 'search' },
];
