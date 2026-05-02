import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  async getDashboardStats() {
    const [orderStats, totalUsers, totalProducts, monthlyRevenue, statusDistribution, revenueByProduct] = await Promise.all([
      this.ordersService.getStats(),
      this.usersService.findAll().then(u => u.length),
      this.productsService.findAll().then(p => p.length),
      this.ordersService.getMonthlyRevenue(),
      this.ordersService.getStatusDistribution(),
      this.ordersService.getRevenueByPlan(),
    ]);

    return {
      totalRevenue: orderStats.totalRevenue,
      totalOrders: orderStats.totalOrders,
      pendingOrders: orderStats.pendingOrders,
      completedOrders: orderStats.completedOrders,
      activeUsers: totalUsers,
      totalProducts,
      monthlyRevenue,
      statusDistribution,
      revenueByProduct,
    };
  }

  async getAllOrders() {
    return this.ordersService.findAll();
  }

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async getAllProducts() {
    return this.productsService.findAll();
  }
}

