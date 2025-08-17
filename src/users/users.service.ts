import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

const DEMO_HASH =
  '$2b$10$FbRjjVxmv8tuAQWnChOYsesIBxxrIqxnSQcD17TX/xJpEf6h8tmye';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });
    console.log('UserService initialized');
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email: username } });
  }

  async validatePassword(hash: string, plain: string) {
    return bcrypt.compare(plain, hash);
  }
}
