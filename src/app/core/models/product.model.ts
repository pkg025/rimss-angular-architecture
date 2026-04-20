export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  discountPercent: number;
  color: string;
  colors: string[];
  sizes: string[];
  description: string;
  imageUrl: string;
  rating: number;
  inStock: boolean;
  isNew: boolean;
}

export interface ProductFilter {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  discounted: boolean;
  color: string;
}