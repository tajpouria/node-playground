import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Product } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async create(product: Product) {
    return await this.productModel.create(product);
  }

  async find() {
    return await this.productModel.find().exec();
  }

  async findById(id: string) {
    return await this.productModel.findById(id);
  }

  async update(id: string, product: Product) {
    return await this.productModel.updateOne({ _id: id }, product);
  }

  async delete(id: string) {
    return await this.productModel.deleteOne({ _id: id });
  }
}
