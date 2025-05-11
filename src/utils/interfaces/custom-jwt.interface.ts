import { TJwtPayload } from '../types';

export interface ICustomJwtService {
  generateAccessToken(userId: string): Promise<string>;

  generateRefreshToken(userId: string): Promise<string>;

  verifyAccessToken(token: string): Promise<TJwtPayload>;

  verifyRefreshToken(token: string): Promise<TJwtPayload>;
}
