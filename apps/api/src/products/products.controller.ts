import { Controller, Get, Param } from '@nestjs/common'
import type { ProductPublic } from '@kramnik/types'

import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<ProductPublic[]> {
    return this.productsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductPublic> {
    return this.productsService.findOne(id)
  }
}