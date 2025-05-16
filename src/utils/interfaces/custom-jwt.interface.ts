import { TJwtPayload } from '../types';

export interface ICustomJwtService {
  generateAccessToken(userId: string, jit: string): Promise<string>;

  generateRefreshToken(userId: string, jit: string): Promise<string>;

  verifyAccessToken(token: string): Promise<TJwtPayload>;

  verifyRefreshToken(token: string): Promise<TJwtPayload>;
}
