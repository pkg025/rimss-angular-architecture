import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OffersComponent } from '../../plugins/offers/offers.component';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, OffersComponent],
  template: `
    <app-offers></app-offers>
    <router-outlet></router-outlet>
  `
})
export class MainLayoutComponent {}