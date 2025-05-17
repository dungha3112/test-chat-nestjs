import { Otps } from '../typeorm';
import { TOtpParams, TOtpResponse } from '../types/otp.type';

export interface IOtpService {
  createOtp(params: TOtpParams): Promise<TOtpResponse>;
  findOneByParam(params: TOtpParams): Promise<Otps>;
}
