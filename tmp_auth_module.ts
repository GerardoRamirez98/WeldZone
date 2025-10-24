import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

// ✅ Configuración segura del JWT
const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'super_secret_key',
  signOptions: { expiresIn: '1h' },
};

@Module({
  imports: [UsersModule, JwtModule.register(jwtConfig)],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // 👈 Estrategia registrada
})
export class AuthModule {}

