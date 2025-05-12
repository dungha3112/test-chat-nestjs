import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedistSocket, Services } from 'src/utils/constants';
import { AuthenticatedSocket, ISocketRedisService } from 'src/utils/interfaces';

@Injectable()
export class SocketRedisService implements ISocketRedisService {
  constructor(@Inject(Services.REDIS_CLIENT) private readonly _redis: Redis) {}

  async getUserSocket(id: string): Promise<AuthenticatedSocket | null> {
    const socketId = await this._redis.get(
      `${RedistSocket.SOCKET_USER_ID}:${id}`,
    );
    if (!socketId) return null;
    else return { id: socketId } as AuthenticatedSocket;
  }

  async setUserSocket(id: string, socket: AuthenticatedSocket): Promise<void> {
    const existingSocketId = await this._redis.get(
      `${RedistSocket.SOCKET_USER_ID}:${id}`,
    );
    if (existingSocketId) {
      await this._redis.del(`${RedistSocket.SOCKET_USER_ID}:${id}`);
    }
    await this._redis.set(`${RedistSocket.SOCKET_USER_ID}:${id}`, socket.id);
  }

  async removeUserSocket(id: string): Promise<void> {
    await this._redis.del(`${RedistSocket.SOCKET_USER_ID}:${id}`);
  }

  async getSockets(): Promise<Map<string, AuthenticatedSocket>> {
    const keys = await this._redis.keys(`${RedistSocket.SOCKET_USER_ID}:*`);
    const sockets = new Map<string, AuthenticatedSocket>();

    for (const key of keys) {
      const socketId = await this._redis.get(key);
      const userId = String(key.split(':')[1]);
      if (socketId) {
        sockets.set(userId, { id: socketId } as AuthenticatedSocket);
      }
    }

    return sockets;
  }
  async getAllOnlineUserIds(): Promise<Set<string>> {
    const keys = await this._redis.keys(`${RedistSocket.SOCKET_USER_ID}:*`);
    const userIds = new Set<string>();

    for (const key of keys) {
      const userId = String(key.split(':')[1]);
      userIds.add(userId);
    }

    return userIds;
  }
}
