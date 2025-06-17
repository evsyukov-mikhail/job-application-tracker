import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';

@Injectable()
export class CryptoService {

  private key: string;
  private iv: Buffer;

  constructor(
    private secretKey: string, 
    private algorithm: string = "aes-256-cbc",
  ) {
    this.key = crypto.
      createHash('sha512').
      update(secretKey).
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