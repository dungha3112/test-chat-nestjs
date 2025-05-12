import { AuthenticatedSocket } from './gateway.interface';

export interface ISocketRedisService {
  getUserSocket(id: string): Promise<AuthenticatedSocket | null>;
  setUserSocket(id: string, socket: AuthenticatedSocket): Promise<void>;
  removeUserSocket(id: string): Promise<void>;
  getSockets(): Promise<Map<string, AuthenticatedSocket>>;
  getAllOnlineUserIds(): Promise<Set<string>>;
}
