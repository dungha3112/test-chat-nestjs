import { TJwtPayload } from './custom-jwt.type';

export interface ICustomJwtService {
  generateAccessToken(userId: string, jit: string): Promise<string>;
  verifyAccessToken(token: string): Promise<TJwtPayload>;

  generateRefreshToken(userId: string, jit: string): Promise<string>;
  verifyRefreshToken(token: string): Promise<TJwtPayload>;
}
