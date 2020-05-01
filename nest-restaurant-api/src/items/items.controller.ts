import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { ItemsService } from './items.service';
import { Item } from '../item';
import { Items } from '../items';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(): Promise<Items> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: number): Promise<Item> {
    return this.itemsService.find(id);
  }   

  @Post()
  create(@Body('item') item: Item): Item {
    return this.itemsService.create(item);
  }

  @Put()
  update(@Body('item') item: Item): Item | null {
    return this.itemsService.update(item);
  }

  @Delete(':id')
  delete(@Param('id') id: number): true | null {
    return this.itemsService.delete(id);
  }
}
