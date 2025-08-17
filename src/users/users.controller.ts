import { Controller, Post, Get, Put, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body()
    body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ) {
    return this.usersService.createUser(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
    );
  }

  @Get()
  async getUser() {
    return this.usersService.findAll();
  }
}
