import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  create(createDto: CreateProductDto) {
    return this.productModel.create(createDto);
  }

  findAll(query: QueryDto) {
    let filter = {};
    if (query.category) {
      filter = { ...filter, category: query.category };
    }
    if (query.search) {
      filter = {
        ...filter,
        $or: [
          { name: new RegExp(query.search, 'i') },
          { description: new RegExp(query.search, 'i') },
        ],
      };
    }
    return this.productModel.find(filter);
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  update(id: string, updateDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }

  deleteAll() {
    return this.productModel.deleteMany({});
  }
}
