import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  // Check username + password, return User if OK
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  // Generate a JWT
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.username, dto.password);

    const payload = { sub: user.id, username: user.username };

    return {
      token: await this.jwt.signAsync(payload),
      data: { name: user.username, email: user.email },
    };
  }
}
