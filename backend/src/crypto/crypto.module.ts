import { Module } from '@nestjs/common';
import { CRYPTO_SECRET_KEY, CryptoService } from './crypto.service';

@Module({
  providers: [
    CryptoService,
    {
      provide: CRYPTO_SECRET_KEY,
      useValue: `${process.env.CRYPTO_SECRET_KEY}`,
    }
  ],
  exports: [CryptoService, CRYPTO_SECRET_KEY],
})
export class CryptoModule {}
