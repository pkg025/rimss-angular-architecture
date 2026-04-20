import {
  Component, OnInit, OnDestroy, inject, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Subject, debounceTime, switchMap, takeUntil, distinctUntilChanged, of
} from 'rxjs';
import { SearchService } from '../../core/services/search.service';
import { Product, ProductFilter } from '../../core/models/product.model';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';
import { PriceDisplayComponent } from '../../shared/price-display/price-display.component';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, StarRatingComponent, PriceDisplayComponent],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss'
})
export class ProductSearchComponent implements OnInit, OnDestroy {
  private readonly searchSvc = inject(SearchService);
  private readonly destroy$ = new Subject<void>();

  searchCtrl = new FormControl('');
  loading = signal(true);

  private allProducts = signal<Product[]>([]);
  filter = signal<ProductFilter>({
    query: '', category: '', minPrice: 0, maxPrice: 500,
    discounted: false, color: ''
  });

  categories = computed(() => this.searchSvc.getCategories(this.allProducts()));

  filteredProducts = computed(() =>
    this.searchSvc.filterProducts(this.allProducts(), this.filter())
  );

  availableColors = [
    { name: 'Navy',    hex: '#1a2e5c' },
    { name: 'Cream',   hex: '#f5f0e8' },
    { name: 'Olive',   hex: '#6b7c3a' },
    { name: 'Burgundy', hex: '#6d1f2e' },
    { name: 'Camel',   hex: '#c19a6b' },
    { name: 'Green',   hex: '#2d5a27' },
  ];

  ngOnInit(): void {
    // Load products once
    this.searchSvc.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.allProducts.set(products);
        this.loading.set(false);
      });

    // RxJS debounceTime + switchMap pipeline — cancels stale requests on each keystroke
    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => of(query ?? '')),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.filter.update(f => ({ ...f, query }));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setCategory(category: string): void {
    this.filter.update(f => ({ ...f, category }));
  }

  setMaxPrice(event: Event): void {
    const val = +(event.target as HTMLInputElement).value;
    this.filter.update(f => ({ ...f, maxPrice: val }));
  }

  toggleDiscounted(): void {
    this.filter.update(f => ({ ...f, discounted: !f.discounted }));
  }

  setColor(color: string): void {
    this.filter.update(f => ({ ...f, color }));
  }

  resetFilters(): void {
    this.searchCtrl.setValue('');
    this.filter.set({ query: '', category: '', minPrice: 0, maxPrice: 500, discounted: false, color: '' });
  }

}
