import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authProviders } from './auth.providers';
import { DatabaseModule } from 'src/database/database.module';
import { CryptoService } from 'src/crypto/crypto.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    CryptoService,
    ...authProviders,
  ]
})
export class AuthModule {}
