import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Message> {
    return this.messageModel.findById(id).exec();
  }

  async update(
    id: string,
    updateMessageDto: Partial<CreateMessageDto>,
  ): Promise<Message> {
    return this.messageModel
      .findByIdAndUpdate(id, updateMessageDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Message> {
    return this.messageModel.findByIdAndDelete(id).exec();
  }

  async markAsRead(id: string): Promise<Message> {
    return this.messageModel
      .findByIdAndUpdate(id, { read: true }, { new: true })
      .exec();
  }
}
