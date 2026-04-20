/**
 * RIMSS Unit Tests (Jest / pure TypeScript)
 * ==========================================
 * Tests the business layer logic of SearchService and PluginRegistry.
 * These are the 2 required unit tests for the assignment, plus extras.
 *
 * Run: npx jest --config jest.config.js
 */

// ── Inline types (mirrors the Angular models) ─────────────────────────────
interface Product {
  id: number; name: string; category: string; price: number;
  discountPercent: number; color: string; colors: string[];
  sizes: string[]; description: string; imageUrl: string;
  rating: number; inStock: boolean; isNew: boolean;
}
interface ProductFilter {
  query: string; category: string; minPrice: number;
  maxPrice: number; discounted: boolean; color: string;
}

// ── Inline SearchService logic (pure functions, no Angular DI) ────────────
function filterProducts(products: Product[], filter: ProductFilter): Product[] {
  return products.filter(p => {
    const matchQuery = !filter.query ||
      p.name.toLowerCase().includes(filter.query.toLowerCase()) ||
      p.category.toLowerCase().includes(filter.query.toLowerCase());
    const matchCategory = !filter.category || p.category === filter.category;
    const discountedPrice = p.price * (1 - p.discountPercent / 100);
    const matchPrice = discountedPrice >= filter.minPrice && discountedPrice <= filter.maxPrice;
    const matchDiscount = !filter.discounted || p.discountPercent > 0;
    const matchColor = !filter.color ||
      p.colors.some(c => c.toLowerCase().includes(filter.color.toLowerCase()));
    return matchQuery && matchCategory && matchPrice && matchDiscount && matchColor;
  });
}
function getCategories(products: Product[]): string[] {
  return [...new Set(products.map(p => p.category))].sort();
}
function getDiscountedPrice(p: Product): number {
  return Math.round(p.price * (1 - p.discountPercent / 100));
}

// ── Inline PluginRegistry logic ───────────────────────────────────────────
interface PluginConfig { name: string; visible: boolean; theme: string; layout: string; }
class PluginRegistry {
  private plugins = new Map<string, () => Promise<any>>();
  private configs = new Map<string, PluginConfig>();

  register(name: string, loader: () => Promise<any>, config?: Partial<PluginConfig>) {
    this.plugins.set(name, loader);
    this.configs.set(name, { name, visible: true, theme: 'light', layout: 'carousel', ...config });
  }
  async load(name: string): Promise<any> {
    const loader = this.plugins.get(name);
    if (!loader) throw new Error(`Plugin "${name}" is not registered.`);
    return loader();
  }
  isVisible(name: string): boolean { return this.configs.get(name)?.visible ?? false; }
  getConfig(name: string): PluginConfig | undefined { return this.configs.get(name); }
  updateConfig(name: string, updates: Partial<PluginConfig>) {
    const cur = this.configs.get(name);
    if (cur) this.configs.set(name, { ...cur, ...updates });
  }
  getRegistered(): string[] { return Array.from(this.plugins.keys()); }
}

// ── Mock data ─────────────────────────────────────────────────────────────
const mockProducts: Product[] = [
  { id: 1, name: 'Merino Wool Sweater', category: 'Sweaters', price: 295,
    discountPercent: 20, color: 'Navy', colors: ['Navy', 'Cream'],
    sizes: ['S', 'M', 'L'], description: '', imageUrl: '', rating: 4.8, inStock: true, isNew: false },
  { id: 2, name: 'Corduroy Trousers', category: 'Trousers', price: 195,
    discountPercent: 0, color: 'Burgundy', colors: ['Burgundy', 'Navy'],
    sizes: ['30', '32', '34'], description: '', imageUrl: '', rating: 4.6, inStock: true, isNew: false },
  { id: 3, name: 'Cashmere Roll-Neck', category: 'Sweaters', price: 425,
    discountPercent: 0, color: 'Camel', colors: ['Camel', 'Charcoal'],
    sizes: ['XS', 'S', 'M'], description: '', imageUrl: '', rating: 5.0, inStock: true, isNew: true },
];

const emptyFilter: ProductFilter = { query: '', category: '', minPrice: 0, maxPrice: 1000, discounted: false, color: '' };

// ══════════════════════════════════════════════════════════════════════════
// UNIT TEST SUITE 1 — SearchService (filterProducts)
// ══════════════════════════════════════════════════════════════════════════
describe('SearchService — filterProducts', () => {

  // REQUIRED TEST 1
  test('should filter products by text query (case-insensitive)', () => {
    const result = filterProducts(mockProducts, { ...emptyFilter, query: 'sweater' });
    expect(result.length).toBe(2);
    expect(result.every(p => p.category === 'Sweaters')).toBe(true);
  });

  // REQUIRED TEST 2
  test('should return only discounted products when discounted=true', () => {
    const result = filterProducts(mockProducts, { ...emptyFilter, discounted: true });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
    expect(result[0].discountPercent).toBeGreaterThan(0);
  });

  test('should filter by category', () => {
    const result = filterProducts(mockProducts, { ...emptyFilter, category: 'Trousers' });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Corduroy Trousers');
  });

  test('should filter by max price using discounted price', () => {
    // Merino discounted = £236, Corduroy = £195, Cashmere = £425
    const result = filterProducts(mockProducts, { ...emptyFilter, maxPrice: 200 });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(2);
  });

  test('should return all products when no filters applied', () => {
    const result = filterProducts(mockProducts, emptyFilter);
    expect(result.length).toBe(3);
  });

  test('should filter by colour', () => {
    const result = filterProducts(mockProducts, { ...emptyFilter, color: 'Camel' });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Cashmere Roll-Neck');
  });

  test('getCategories returns unique sorted categories', () => {
    const cats = getCategories(mockProducts);
    expect(cats).toEqual(['Sweaters', 'Trousers']);
  });

  test('getDiscountedPrice calculates correctly', () => {
    expect(getDiscountedPrice(mockProducts[0])).toBe(236); // 295 * 0.8
    expect(getDiscountedPrice(mockProducts[1])).toBe(195); // no discount
  });
});

// ══════════════════════════════════════════════════════════════════════════
// UNIT TEST SUITE 2 — PluginRegistry
// ══════════════════════════════════════════════════════════════════════════
describe('PluginRegistry', () => {
  let registry: PluginRegistry;

  beforeEach(() => { registry = new PluginRegistry(); });

  // REQUIRED TEST 3
  test('should register a plugin and mark it visible by default', () => {
    registry.register('offers', () => Promise.resolve({}));
    expect(registry.isVisible('offers')).toBe(true);
    expect(registry.getRegistered()).toContain('offers');
  });

  // REQUIRED TEST 4
  test('should allow hiding a plugin via updateConfig', () => {
    registry.register('offers', () => Promise.resolve({}));
    registry.updateConfig('offers', { visible: false });
    expect(registry.isVisible('offers')).toBe(false);
  });

  test('getConfig returns correct plugin config', () => {
    registry.register('offers', () => Promise.resolve({}), { theme: 'dark', layout: 'banner' });
    const config = registry.getConfig('offers');
    expect(config?.theme).toBe('dark');
    expect(config?.layout).toBe('banner');
  });

  test('isVisible returns false for unregistered plugin', () => {
    expect(registry.isVisible('non-existent')).toBe(false);
  });

  test('load throws for unregistered plugin', async () => {
    await expect(registry.load('unknown')).rejects.toThrow('Plugin "unknown" is not registered.');
  });

  test('multiple plugins register independently', () => {
    registry.register('offers', () => Promise.resolve({}));
    registry.register('recommendations', () => Promise.resolve({}));
    expect(registry.getRegistered()).toContain('offers');
    expect(registry.getRegistered()).toContain('recommendations');
    expect(registry.getRegistered().length).toBe(2);
  });

  test('updateConfig updates only specified property', () => {
    registry.register('offers', () => Promise.resolve({}), { theme: 'dark', layout: 'carousel' });
    registry.updateConfig('offers', { theme: 'light' });
    const config = registry.getConfig('offers');
    expect(config?.theme).toBe('light');
    expect(config?.layout).toBe('carousel'); // unchanged
  });
});
