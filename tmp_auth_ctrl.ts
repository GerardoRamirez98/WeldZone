import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

interface AuthenticatedUser {
  userId: number;
  username: string;
  role: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ Endpoint de login
  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }

  // ✅ Obtener usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: { user: AuthenticatedUser }) {
    return { user: req.user };
  }
}

