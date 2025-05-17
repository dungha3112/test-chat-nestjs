import { TOtpType } from '../types/otp.type';

export interface IEmailService {
  sendMailOTP(to: string, otp: string, type: TOtpType);
  sendMailToken(to: string, url: string, type: TOtpType);
}
