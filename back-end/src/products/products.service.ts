import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  create(data: any) {
    return this.productModel.create(data);
  }

  findAll(query: any = {}) {
    let filter = {};
    if (query.category) {
      filter = { ...filter, category: query.category };
    }
    if (query.search) {
      filter = { 
        ...filter, 
        $or: [
          { name: new RegExp(query.search, 'i') },
          { description: new RegExp(query.search, 'i') }
        ]
      };
    }
    return this.productModel.find(filter);
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }
}