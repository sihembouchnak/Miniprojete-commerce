import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ type: [{ name: String, price: Number, quantity: Number }], default: [] })
  items: { name: string; price: number; quantity: number }[];

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ default: new Date() })
  date: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

