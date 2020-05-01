import { ItemsService } from './items.service';
import { Item } from '../item';
import { Items } from '../items';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    findAll(): Promise<Items>;
    find(id: number): Promise<Item>;
    create(item: Item): Item;
    update(item: Item): Item | null;
    delete(id: number): true | null;
}
