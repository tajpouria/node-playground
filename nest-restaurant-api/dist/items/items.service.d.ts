import { Items } from '../items';
import { Item } from '../item';
export declare class ItemsService {
    private readonly items;
    findAll: () => Items;
    create: (newItems: Item) => Item;
    find: (id: number) => Item;
    update: (updatedItem: Item) => Item;
    delete: (id: number) => true;
}
