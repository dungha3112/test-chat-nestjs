import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ICustomJwtService } from 'src/utils/interfaces';
import { TJwtPayload } from 'src/utils/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CustomJwtService implements ICustomJwtService {
  constructor(private readonly _jwtService: JwtService) {}

  async generateAccessToken(userId: string): Promise<string> {
    const accessToken = await this._jwtService.signAsync({
      userId,
      jit: uuidv4(),
    });
    return accessToken;
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = await this._jwtService.signAsync(
      { userId, jit: uuidv4() },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      },
    );
    return refreshToken;
  }

  async verifyAccessToken(token: string): Promise<TJwtPayload> {
    const payload = await this._jwtService.verifyAsync(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });

    return payload;
  }

  async verifyRefreshToken(token: string): Promise<TJwtPayload> {
    const payload = await this._jwtService.verifyAsync(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    return payload;
  }
}
