import { Controller, Get, Param, Query } from '@nestjs/common'
import type { ProductPublic } from '@kramnik/types'

import { ListProductsQueryDto } from './dto/list-products-query.dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: ListProductsQueryDto): Promise<ProductPublic[]> {
    return this.productsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductPublic> {
    return this.productsService.findOne(id)
  }
}