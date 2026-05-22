import { Category } from '@prisma/client'
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator'

export class ListProductsQueryDto {
    @IsOptional()
    @IsEnum(Category)
    category?: Category
    @IsOptional()
    @IsString()
    q?: string
    @IsOptional()
    @IsNumberString()
    minPrice?: string
    @IsOptional()
    @IsNumberString()
    maxPrice?: string
}
