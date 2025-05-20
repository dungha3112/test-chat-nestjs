import { Socket } from 'socket.io';
import { User } from '../utils/typeorm';

export interface AuthenticatedSocket extends Socket {
  user?: User;
}
