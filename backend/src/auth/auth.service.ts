import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { CryptoService } from 'src/crypto/crypto.service';
import { UserDTO } from 'src/dtos/user.dto';
import { AuthResult } from 'src/interfaces/auth-result.interface';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: UserDTO): Promise<AuthResult> {
    const userExists = await this.userModel.findOne({ $or: [{ username: dto.username }, { email: dto.email }] });
    if (userExists) {
      throw new Error(`User with username ${dto.username} or email ${dto.email} already exists`);
    }

    const user = new this.userModel({
      ...dto,
      password: this.cryptoService.encrypt(dto.password),
    });
    const { username, email } = await user.save();

    return {
      username,
      email,
      token: await this.jwtService.signAsync({ username, email })
    }
  }

  async logIn({ username, email, password }: UserDTO): Promise<AuthResult> {
    const user = await this.userModel.findOne({ username, email });
    if (!user) {
      throw new Error(`User with username ${username} and email ${email} was not found`);
    }

    if (this.cryptoService.decrypt(user.password) !== password) {
      throw new Error("Passwords don't match");
    }

    return {
      username,
      email,
      token: await this.jwtService.signAsync({ username, email }),
    };
  }
}
