import { Injectable } from '@nestjs/common';

import { Items } from '../items';
import { Item } from '../item';

@Injectable()
export class ItemsService {
  private readonly items: Items = {
    1: {
      id: 1,
      name: 'Burger',
      price: 5.99,
      description: 'Tasty',
      image: 'https://cdn.auth0.com/blog/whatabyte/burger-sm.png',
    },
    2: {
      id: 2,
      name: 'Pizza',
      price: 2.99,
      description: 'Cheesy',
      image: 'https://cdn.auth0.com/blog/whatabyte/pizza-sm.png',
    },
    3: {
      id: 3,
      name: 'Tea',
      price: 1.99,
      description: 'Informative',
      image: 'https://cdn.auth0.com/blog/whatabyte/tea-sm.png',
    },
  };

  findAll = (): Items => this.items;

  create = (newItems: Item): Item => {
    const id = newItems.id || new Date().valueOf();
    const item: Item = {
      ...newItems,
      id,
    };

    this.items[id] = item;

    return item;
  };

  find = (id: number): Item | null => this.items[id] ?? null;

  update = (updatedItem: Item): Item | null => {
    const item = this.items[updatedItem.id];

    if (item) {
      this.items[updatedItem.id] = updatedItem;
      return updatedItem;
    }

    return null;
  };

  delete = (id: number): true | null => {
    if (this.items[id]) {
      delete this.items[id];
      return true;
    }

    return null;
  };
}
