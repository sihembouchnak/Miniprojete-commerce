import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async create(data: any) {
    return this.orderModel.create(data);
  }

  async findAll(query: any = {}) {
    let filter = {};
    if (query.status) filter = { ...filter, status: query.status };
    return this.orderModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findRecent(limit: number = 10) {
    return this.orderModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }

  async findOne(id: string) {
    return this.orderModel.findById(id).exec();
  }

  async countDocuments() {
    return this.orderModel.countDocuments().exec();
  }

  async getStats() {
    const totalRevenue = await this.orderModel.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalOrders = await this.orderModel.countDocuments();
    const pendingOrders = await this.orderModel.countDocuments({ status: 'pending' });
    const completedOrders = await this.orderModel.countDocuments({ status: 'completed' });
    return {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      pendingOrders,
      completedOrders,
    };
  }

  async getMonthlyRevenue(year: number = new Date().getFullYear()) {
    return this.orderModel.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$date' },
          revenue: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getRevenueByPlan() {
    return this.orderModel.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          sales: { $sum: '$items.quantity' },
        },
      },
      { $sort: { revenue: -1 } },
    ]);
  }

  async getStatusDistribution() {
    return this.orderModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }
}

