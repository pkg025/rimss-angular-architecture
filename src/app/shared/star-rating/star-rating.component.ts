import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <span class="stars">{{ stars() }}</span>
    @if (showValue()) {
      <span class="rating-val">{{ rating() }}{{ outOfFive() ? ' out of 5' : '' }}</span>
    }
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; gap: 4px; }
    .stars { color: #c9a84c; letter-spacing: 1px; }
    .rating-val { font-size: 0.85rem; color: #666; }
  `]
})
export class StarRatingComponent {
  rating = input.required<number>();
  showValue = input<boolean>(true);
  outOfFive = input<boolean>(false);

  stars = computed(() => {
    const full = Math.round(this.rating());
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  });
}
