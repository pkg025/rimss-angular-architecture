import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { PluginRegistry } from './plugins/plugin-registry.service';

function initPlugins(registry: PluginRegistry) {
  return () => {
    registry.register(
      'offers',
      () => import('./plugins/offers/offers.component')
            .then(m => m.OffersComponent),
      { visible: true, theme: 'dark', layout: 'banner' }
    );
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: initPlugins,
      deps: [PluginRegistry],
      multi: true,
    },
  ],
};
