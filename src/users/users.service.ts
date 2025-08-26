// Business logic: hashing, duplication checks, safe selects

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto) {
    // 1) Reject duplicate emails
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    // 2) Hash password before saving
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 3) Create and persist
    const user = this.repo.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    return this.repo.save(user);
  }

  async findAllSafe() {
    // Return only non-sensitive columns
    return this.repo.find({
      select: ['id', 'email', 'firstName', 'lastName'],
      order: { id: 'ASC' },
    });
  }

  async findByUsername(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findByEmail(email: string) {
    return this.findByUsername(email);
  }
}
