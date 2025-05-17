export type TOtpType = 'verify_email' | 'reset_password';

export type TOtpParams = {
  email: string;
  type: TOtpType;
};

export type TOtpResponse = {
  otp: string;
  type: TOtpType;
  otpHash: string;
};
