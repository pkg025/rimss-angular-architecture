import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product, ProductFilter } from '../models/product.model';

/**
 * SearchService — typed interface abstracting product search.
 * The backend implementation (REST, Elasticsearch, etc.) can change
 * without any Angular component changes.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly dataUrl = 'assets/data/products.json';

  /** Fetch all products from mock JSON (simulates GET /api/products) */
  getProducts(): Observable<Product[]> {
    // Skip HTTP during SSR — relative URLs cannot be resolved by the Node server.
    // The browser will fetch on hydration.
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }
    return this.http.get<Product[]>(this.dataUrl).pipe(
      catchError(() => of([]))
    );
  }

  /** Fetch single product by id (simulates GET /api/products/:id) */
  getProductById(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  /**
   * Filter products client-side (in production this would be a server-side query).
   * Demonstrates the SearchService interface — swap with any backend without
   * touching components.
   */
  filterProducts(products: Product[], filter: ProductFilter): Product[] {
    return products.filter(p => {
      const matchQuery = !filter.query ||
        p.name.toLowerCase().includes(filter.query.toLowerCase()) ||
        p.category.toLowerCase().includes(filter.query.toLowerCase());

      const matchCategory = !filter.category || p.category === filter.category;

      const discountedPrice = p.price * (1 - p.discountPercent / 100);
      const matchPrice =
        discountedPrice >= filter.minPrice &&
        discountedPrice <= filter.maxPrice;

      const matchDiscount = !filter.discounted || p.discountPercent > 0;

      const matchColor = !filter.color ||
        p.colors.some(c => c.toLowerCase().includes(filter.color.toLowerCase()));

      return matchQuery && matchCategory && matchPrice && matchDiscount && matchColor;
    });
  }

  /** Returns unique categories from product list */
  getCategories(products: Product[]): string[] {
    return [...new Set(products.map(p => p.category))].sort();
  }
}
