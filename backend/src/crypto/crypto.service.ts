import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

export const CRYPTO_SECRET_KEY = "CRYPTO_SECRET_KEY";

@Injectable()
export class CryptoService {

  private key: string;
  private iv: Buffer;
  private algorithm: string = "aes-256-cbc";

  constructor(
    @Inject(CRYPTO_SECRET_KEY)
    private secretKey: string,
  ) {
    this.key = crypto.createHash('sha512').
      update(this.secretKey).
      digest('hex').
      substring(0, 32);

    this.iv = crypto.randomBytes(16);
  }

  encrypt(data: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), this.iv);
    const encrypted = cipher.update(data, 'utf-8', 'hex') + cipher.final('hex');

    return this.iv.toString('hex') + encrypted;
  }

  decrypt(data: string): string {
    const inputIV = data.slice(0, 32);
    const encrypted = data.slice(32);

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key),
      Buffer.from(inputIV, 'hex')
    );

    return decipher.update(encrypted, 'hex', 'utf-8') + decipher.final('utf-8');
  }

}