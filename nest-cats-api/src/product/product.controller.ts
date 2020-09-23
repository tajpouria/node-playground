import { Controller, Get, Param, BadRequestException, NotFoundException } from '@nestjs/common';

import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts() {
    return this.productService.getProducts();
  }

  @Get('/:product_id')
  getProductByID(@Param('product_id') pID: string) {
    const numPID = parseInt(pID);

    if (isNaN(numPID))
      throw new BadRequestException(
        'product_id request paramter is not specified or is not valid.',
      );

    const p = this.productService.getProductById(numPID);

    if (!p)
      throw new NotFoundException(`Product with ID ${numPID} if not defined.`);

    return p;
  }
}
