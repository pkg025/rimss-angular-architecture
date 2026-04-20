import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-price-display',
  standalone: true,
  template: `
    @if (discountPercent() > 0) {
      <span class="price-sale">£{{ discountedPrice() }}</span>
      <span class="price-original">£{{ price() }}</span>
      @if (showSavings()) {
        <span class="price-saving">Save £{{ savings() }}</span>
      }
    } @else {
      <span class="price-regular">£{{ price() }}</span>
    }
  `,
  styles: [`
    :host { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
    .price-sale { font-size: 1.25rem; font-weight: 700; color: #c0392b; }
    .price-original { font-size: 0.9rem; text-decoration: line-through; color: #999; }
    .price-regular { font-size: 1.25rem; font-weight: 700; color: #1a1a1a; }
    .price-saving { font-size: 0.8rem; color: #27ae60; font-weight: 600; }
  `]
})
export class PriceDisplayComponent {
  price = input.required<number>();
  discountPercent = input<number>(0);
  showSavings = input<boolean>(false);

  discountedPrice = computed(() => Math.round(this.price() * (1 - this.discountPercent() / 100)));
  savings = computed(() => Math.round(this.price() * this.discountPercent() / 100));
}
