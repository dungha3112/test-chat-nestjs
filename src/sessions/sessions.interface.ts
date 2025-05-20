import { Sessions } from 'src/utils/typeorm';
import { TCreateSessionParams, TFindSessionByParams } from './sessions.type';

export interface ISessionService {
  createNewSession(params: TCreateSessionParams): Promise<Sessions>;
  findOneByParams(params: TFindSessionByParams): Promise<Sessions>;
  findSessionById(id: string): Promise<Sessions>;
  deleteSessionById(id: string): Promise<Sessions>;

  deleteSessionByParams(params: TFindSessionByParams): Promise<Sessions>;
}
