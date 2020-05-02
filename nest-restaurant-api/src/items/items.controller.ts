import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body('item') item: Item): Item {
    return this.itemsService.create(item);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  update(@Body('item') item: Item): Item | null {
    return this.itemsService.update(item);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: number): true | null {
    return this.itemsService.delete(id);
  }
}
