import { Component, Input, signal } from '@angular/core';

export interface Offer {
  id: number;
  title: string;
  subtitle: string;
  code: string;
  badgeColor: string;
}

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent {
  @Input() theme: 'light' | 'dark' = 'dark';

  visible = signal(true);

  offers: Offer[] = [
    { id: 1, title: '20% Off', subtitle: 'All Sweaters', code: 'WOOL20', badgeColor: '#C97B1A' },
    { id: 2, title: 'Free Delivery', subtitle: 'Orders over £200', code: 'FREESHIP', badgeColor: '#0E7C74' },
    { id: 3, title: 'New Season', subtitle: 'SS26 Collection', code: 'SS26NEW', badgeColor: '#185FA5' },
  ];

  hide(): void {
    this.visible.set(false);
  }
}
