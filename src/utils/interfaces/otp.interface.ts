import { Otps } from '../typeorm';
import { TOtpParams } from '../types/otp.type';

export interface IOtpService {
  createOtp(params: TOtpParams): Promise<string>;
  findOneByParam(params: TOtpParams): Promise<Otps>;
}
