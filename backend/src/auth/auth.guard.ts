import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }

    try {
      const { username, email } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY
      });

      const user = await this.userModel.findOne({ username, email });
      if (!user) {
        throw new NotFoundException(`Failed to find user by username ${username} and email ${email}`);
      }

      request.body['userId'] = user._id;
    } catch (error) {
      throw new UnauthorizedException((error as Error).message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : null;
  }
}
