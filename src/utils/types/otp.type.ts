export type TOtpType = 'verify_email' | 'reset_password';

export type TOtpParams = {
  email: string;
  type: TOtpType;
};

export type TOtpResponse = TOtpParams & {
  otp: string;
};
