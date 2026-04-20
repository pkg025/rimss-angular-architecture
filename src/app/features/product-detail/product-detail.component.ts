import {
  Component, OnInit, inject, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SearchService } from '../../core/services/search.service';
import { Product } from '../../core/models/product.model';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';
import { PriceDisplayComponent } from '../../shared/price-display/price-display.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StarRatingComponent, PriceDisplayComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private readonly searchSvc = inject(SearchService);
  private readonly route = inject(ActivatedRoute);

  product = signal<Product | undefined>(undefined);
  loading = signal(true);
  selectedColor = signal('');
  selectedSize = signal('');
  addedToCart = signal(false);

  discountedPrice = computed(() => {
    const p = this.product();
    if (!p) return 0;
    return Math.round(p.price * (1 - p.discountPercent / 100));
  });

  savings = computed(() => {
    const p = this.product();
    if (!p) return 0;
    return Math.round(p.price * p.discountPercent / 100);
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.searchSvc.getProductById(id).subscribe(product => {
      this.product.set(product);
      if (product) {
        this.selectedColor.set(product.colors[0]);
      }
      this.loading.set(false);
    });
  }

  addToCart(): void {
    if (!this.selectedSize()) return;
    this.addedToCart.set(true);
    // Reset after 3 seconds
    setTimeout(() => this.addedToCart.set(false), 3000);
  }

}
