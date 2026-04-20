import { Injectable } from '@angular/core';
import { Route } from '@angular/router';

export interface PluginConfig {
  name: string;
  visible: boolean;
  theme: 'light' | 'dark';
  layout: 'banner' | 'carousel';
}

/**
 * PluginRegistry — central registry for dynamically loadable feature modules.
 *
 * New modules (Offers, Recommendations, Loyalty, etc.) self-register here
 * at startup via loadChildren. This satisfies the Open/Closed Principle:
 *   - Open for extension: add a new plugin without changing existing code
 *   - Closed for modification: core app routing/bootstrap is never touched
 *
 * In production, plugin visibility could be driven by a remote feature-flag
 * service, allowing runtime enable/disable without redeployment.
 */
@Injectable({ providedIn: 'root' })
export class PluginRegistry {
  private plugins = new Map<string, () => Promise<any>>();
  private configs = new Map<string, PluginConfig>();

  /** Register a lazy-loadable plugin module */
  register(name: string, loader: () => Promise<any>, config?: Partial<PluginConfig>): void {
    this.plugins.set(name, loader);
    this.configs.set(name, {
      name,
      visible: true,
      theme: 'light',
      layout: 'carousel',
      ...config,
    });
  }

  /** Load a registered plugin module */
  async load(name: string): Promise<any> {
    const loader = this.plugins.get(name);
    if (!loader) {
      throw new Error(`[PluginRegistry] Plugin "${name}" is not registered.`);
    }
    return loader();
  }

  /** Check if a plugin is registered and visible */
  isVisible(name: string): boolean {
    return this.configs.get(name)?.visible ?? false;
  }

  /** Get plugin config */
  getConfig(name: string): PluginConfig | undefined {
    return this.configs.get(name);
  }

  /** Update plugin config (show/hide, theme, layout) */
  updateConfig(name: string, updates: Partial<PluginConfig>): void {
    const current = this.configs.get(name);
    if (current) {
      this.configs.set(name, { ...current, ...updates });
    }
  }

  /** Get Angular router routes for all registered plugins */
  getRoutes(): Route[] {
    return Array.from(this.plugins.entries()).map(([name, loader]) => ({
      path: `plugin/${name}`,
      loadChildren: loader,
    }));
  }

  /** List all registered plugin names */
  getRegistered(): string[] {
    return Array.from(this.plugins.keys());
  }
}
