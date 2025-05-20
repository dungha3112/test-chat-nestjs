import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { TOtpType } from 'src/otp/otp.type';
import { IEmailService } from './email.interface';

@Injectable()
export class EmailService implements IEmailService {
  private readonly _transporter: nodemailer.Transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'Gmail',
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.EMAIL_APP_ADDRESS}`,
        pass: `${process.env.EMAIL_APP_PASSWORD}`,
      },
    });
  }

  async sendMailToken(to: string, url: string, type: TOtpType) {
    const path = type === 'verify_email' ? 'verify_email' : 'reset_password';
    const newUrl = `${process.env.BASE_CLIENT_URL}/${path}/${url}`;

    try {
      const mailOption = {
        from: `${process.env.EMAIL_APP_ADDRESS}`,
        to: to,
        subject: `${type === 'verify_email' ? 'Account Verification from ChatApp' : 'Password Recovery from ChatApp'}`,
        html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the ChatApp</h2>
          
          <p>
            ${
              type === 'verify_email'
                ? 'Congratulations on registering for a ChatApp account..'
                : 'You have requested a password reset for your ChatApp account.'
            }
          </p>

          <a href=${newUrl} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
            -> Click here !
          </a>
          
          <p>Verification token is valid for 10 minutes.</p>
      
          <p>If the button doesn't work for any reason, you can also click on the link below:</p>
      
          <div>${newUrl}</div>
        </div>
      `,
      };
      const result = await this._transporter.sendMail(mailOption);
      return result;
    } catch (error) {
      console.log(`=> Error send mail: ${error}`);
      throw new Error('Error send mail otp: ' + error);
    }
  }

  async sendMailOTP(to: string, otp: string, type: TOtpType) {
    try {
      const mailOption = {
        from: `${process.env.EMAIL_APP_ADDRESS}`,
        to: to,
        subject: `${type === 'verify_email' ? 'Email Verification - OTP Code from ChatApp' : 'Password Recovery - OTP Code from ChatApp'}`,
        html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the ChatApp</h2>
          
          <p>
            ${
              type === 'verify_email'
                ? 'Congratulations on registering for a ChatApp account..'
                : 'You have requested a password reset for your ChatApp account.'
            }
          </p>
          
          <p>
            Your code OTP: 
            <span style="font-size:14px; font-weight: bold;">
              ${otp}
            </span>
          </p>
          
          <p>OTP code is valid for 10 minutes.</p>
    
        </div>
      `,
      };
      const result = await this._transporter.sendMail(mailOption);
      return result;
    } catch (error) {
      console.log(`=> Error send mail: ${error}`);
      throw new Error('Error send mail otp: ' + error);
    }
  }
}
