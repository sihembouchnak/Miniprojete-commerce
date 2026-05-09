import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.usersService.create({ name, email, password: hash });
  }

  async login(email: string, password: string) {
    // Special case for demo admin
    if (email === 'admin@smartstore.com' && password === 'admin123') {
      const token = this.jwtService.sign({ id: 'admin' });
      return {
        access_token: token,
        user: { name: 'Admin', email, role: 'admin' }
      };
    }

    // For demo purposes, allow any login
    const token = this.jwtService.sign({ id: email });
    return {
      access_token: token,
      user: { name: email.split('@')[0], email, role: 'user' }
    };
  }
}