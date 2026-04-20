import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PluginRegistry } from '../../plugins/plugin-registry.service';
import { OffersComponent } from '../../plugins/offers/offers.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, OffersComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  private readonly registry = inject(PluginRegistry);
  offersVisible = false;

  ngOnInit(): void {
    this.offersVisible = this.registry.isVisible('offers');
  }
}
