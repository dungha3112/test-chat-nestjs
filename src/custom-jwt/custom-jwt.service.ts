import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ICustomJwtService } from './custom-jwt.interface';
import { TJwtPayload } from './custom-jwt.type';

@Injectable()
export class CustomJwtService implements ICustomJwtService {
  constructor(private readonly _jwtService: JwtService) {}

  async generateAccessToken(userId: string, jit: string): Promise<string> {
    const accessToken = await this._jwtService.signAsync({ userId, jit });
    return accessToken;
  }

  async verifyAccessToken(token: string): Promise<TJwtPayload> {
    const payload = await this._jwtService.verifyAsync(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });

    return payload;
  }

  async generateRefreshToken(userId: string, jit: string): Promise<string> {
    const refreshToken = await this._jwtService.signAsync(
      { userId, jit },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      },
    );
    return refreshToken;
  }

  async verifyRefreshToken(token: string): Promise<TJwtPayload> {
    const payload = await this._jwtService.verifyAsync(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    return payload;
  }
}
