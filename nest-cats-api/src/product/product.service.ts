import {Injectable} from '@nestjs/common';

@Injectable()
export class ProductService{
  private readonly products = [
    { id: 1, name: 'foo' },
    { id: 2, name: 'bar' },
    { id: 3, name: 'baz' },
  ];

  public getProducts() {
    return this.products;
  }

  public getProductById(id: number) {
    for (let p of this.products) if (p.id === id) return p;

    return null;
  }
}
