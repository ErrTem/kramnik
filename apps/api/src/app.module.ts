import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PrismaModule } from './prisma/prisma.module'
import { ProductsModule } from './products/products.module'

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [AppController],
})
export class AppModule {}