import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '../models/product.model';

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Shirt', price: 1000, image: '' },
  { id: 2, name: 'Jeans', price: 2000, image: '' },
  { id: 3, name: 'Shoes', price: 3000, image: '' },
  { id: 4, name: 'Jacket', price: 4000, image: '' },
  { id: 5, name: 'T-Shirt', price: 800, image: '' }
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  search(query: string) {
    const filtered = MOCK_PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );

    return of(filtered).pipe(delay(300));
  }

  getById(id: number) {
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    return of(product);
  }
}