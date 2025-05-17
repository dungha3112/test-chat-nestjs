import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOtpService } from 'src/utils/interfaces';
import { Otps } from 'src/utils/typeorm';
import { TOtpParams } from 'src/utils/types/otp.type';
import { Repository } from 'typeorm';

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    @InjectRepository(Otps) private readonly _otpRepository: Repository<Otps>,
  ) {}

  async createOtp(params: TOtpParams): Promise<string> {
    const { email, type } = params;

    const existing = await this.findOneByParam(params);

    if (existing && existing.expiresAt > new Date()) {
    }

    return '';
  }

  async findOneByParam(params: TOtpParams): Promise<Otps> {
    return await this._otpRepository.findOne({ where: params });
  }
}
