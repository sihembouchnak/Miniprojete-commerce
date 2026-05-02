import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [OrdersModule, ProductsModule, UsersModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}

