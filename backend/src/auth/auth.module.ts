import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authProviders } from './auth.providers';
import { DatabaseModule } from 'src/database/database.module';
import { CryptoService } from 'src/crypto/crypto.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [DatabaseModule, CryptoModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET_KEY,
    signOptions: { expiresIn: '1h' },
  })],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...authProviders,
  ]
})
export class AuthModule {}
