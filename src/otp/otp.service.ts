import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { decryptOtp, encryptOtp, generateOtpCode } from 'src/utils/helpers';
import { IOtpService } from 'src/utils/interfaces';
import { Otps } from 'src/utils/typeorm';
import { TOtpParams, TOtpResponse } from 'src/utils/types/otp.type';
import { Repository } from 'typeorm';

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    @InjectRepository(Otps) private readonly _otpRepository: Repository<Otps>,
  ) {}

  async createOtp(params: TOtpParams): Promise<TOtpResponse> {
    const { email, type } = params;

    const existing = await this.findOneByParam(params);

    if (existing && existing.expiresAt > new Date()) {
      const originalOtp = decryptOtp(existing.otp);
      return { otp: originalOtp, otpHash: existing.otp, type };
    }

    const otp = generateOtpCode();
    const hashedOtp = encryptOtp(otp);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    /////////////////////////
    if (existing) {
      existing.otp = hashedOtp;
      existing.expiresAt = expiresAt;
      existing.type = type;

      await this.saveOtp(existing);

      return { otp, otpHash: hashedOtp, type };
    } else {
      const newOtp = this._otpRepository.create({
        email: email,
        type,
        otp: hashedOtp,
        expiresAt,
      });
      await this.saveOtp(newOtp);

      return { otp, otpHash: hashedOtp, type };
    }
  }

  async saveOtp(otp: Otps): Promise<Otps> {
    return await this._otpRepository.save(otp);
  }

  async findOneByParam(params: TOtpParams): Promise<Otps> {
    const { email, type } = params;
    return await this._otpRepository.findOne({ where: { email, type } });
  }

  async deleteById(id: string): Promise<Otps> {
    const otp = await this._otpRepository.findOne({ where: { id } });
    if (!otp)
      throw new HttpException('Otp not found with id', HttpStatus.NOT_FOUND);

    await this._otpRepository.delete({ id });

    return otp;
  }
}
