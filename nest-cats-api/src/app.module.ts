import { Module } from '@nestjs/common';

import { ProductModule } from './product/product.module';
import { AppController } from './app.controller';

@Module({
  imports: [ProductModule],
  controllers: [AppController],
})
export class AppModule {}
