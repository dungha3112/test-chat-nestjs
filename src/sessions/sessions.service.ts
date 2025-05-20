import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ISessionService } from './sessions.interface';
import { Sessions } from 'src/utils/typeorm';
import { TCreateSessionParams, TFindSessionByParams } from './sessions.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SessionsService implements ISessionService {
  constructor(
    @InjectRepository(Sessions)
    private readonly _sessionRepository: Repository<Sessions>,
  ) {}

  async createNewSession(params: TCreateSessionParams): Promise<Sessions> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = this._sessionRepository.create({ ...params, expiresAt });

    const savedSession = await this._sessionRepository.save(session);

    return savedSession;
  }

  async findOneByParams(params: TFindSessionByParams): Promise<Sessions> {
    const { userId, jit } = params;
    const session = await this._sessionRepository.findOne({
      where: { userId, jit },
    });
    if (!session)
      throw new HttpException(
        'User logged out from this device',
        HttpStatus.UNAUTHORIZED,
      );

    return session;
  }

  async findSessionById(id: string): Promise<Sessions> {
    const session = await this.findSessionById(id);

    if (!session)
      throw new HttpException(
        'User logged out from this device',
        HttpStatus.UNAUTHORIZED,
      );

    return session;
  }

  async deleteSessionById(id: string): Promise<Sessions> {
    const session = await this.findSessionById(id);

    await this._sessionRepository.delete({ id });

    return session;
  }

  async deleteSessionByParams(params: TFindSessionByParams): Promise<Sessions> {
    const { userId, jit } = params;
    await this._sessionRepository.delete({ userId, jit });

    const session = await this._sessionRepository.findOne({
      where: { userId, jit },
    });

    return session;
  }
}
