import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authProviders } from './auth.providers';
import { DatabaseModule } from 'src/database/database.module';
import { CryptoService } from 'src/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [DatabaseModule, CryptoModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    ...authProviders,
  ]
})
export class AuthModule {}
