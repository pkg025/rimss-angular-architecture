import { Component, signal, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent {

  // ✅ Modern Angular DI
  private productService = inject(ProductService);

  // Form + State
  searchControl = new FormControl('');
  products = signal<any[]>([]);

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.productService.search(value || ''))
      )
      .subscribe(data => this.products.set(data));
  }
}