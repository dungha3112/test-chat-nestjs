import { Otps } from '../utils/typeorm';
import { TOtpParams, TOtpResponse } from './otp.type';

export interface IOtpService {
  createOtp(params: TOtpParams): Promise<TOtpResponse>;
  findOneByParam(params: TOtpParams): Promise<Otps>;
  deleteById(id: string): Promise<Otps>;
}
