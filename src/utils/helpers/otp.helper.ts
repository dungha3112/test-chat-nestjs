import * as CryptoJS from 'crypto-js';

import * as dotenv from 'dotenv';
dotenv.config();

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const encryptOtp = (otp: string) => {
  const key = process.env.CRYPTO_KEY;
  if (!key) throw new Error('CRYPTO_KEY is not defined in .env');

  return CryptoJS.AES.encrypt(otp, key).toString();
};

export const decryptOtp = (ciphertext: string) => {
  const key = process.env.CRYPTO_KEY;
  if (!key) throw new Error('CRYPTO_KEY is not defined in .env');

  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const compareOtp = (otpOrigin: string, otpHash: string) => {
  return otpOrigin === decryptOtp(otpHash);
};
