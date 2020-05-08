import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Get,
  Patch,
  NotFoundException,
  Delete,
  Param,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { Product } from './product.model';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  find() {
    return this.productService.find();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    try {
      return this.productService.findById(id);
    } catch (error) {
      console.error(error);
      throw new NotFoundException();
    }
  }

  @Post()
  create(@Body() product: Product) {
    try {
      return this.productService.create(product);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() product: Product) {
    try {
      return this.productService.update(id, product);
    } catch (error) {
      console.error(error);
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    try {
      return this.productService.delete(id);
    } catch (error) {
      console.error(error);
      throw new NotFoundException();
    }
  }
}
