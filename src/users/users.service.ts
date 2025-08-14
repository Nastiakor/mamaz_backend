import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

const DEMO_HASH =
  '$2b$10$FbRjjVxmv8tuAQWnChOYsesIBxxrIqxnSQcD17TX/xJpEf6h8tmye';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      username: 'demo',
      email: 'demo@example.com',
      passwordHash: DEMO_HASH,
    },
  ];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ email, password });
    console.log('UserService initialized');
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByUsername(username: string) {
    return this.users.find((u) => u.username === username) ?? null;
  }

  async validatePassword(hash: string, plain: string) {
    return bcrypt.compare(plain, hash);
  }
}
