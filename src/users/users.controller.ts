// HTTP layer: delegates to service and returns safe payloads

import { Controller, Post, Get, Put, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Public signup (later to move to /auth/signup)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto);
    // Return only safe fields (never the passwordHash)
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  @Get()
  async getUser() {
    return this.usersService.findAllSafe();
  }
}
