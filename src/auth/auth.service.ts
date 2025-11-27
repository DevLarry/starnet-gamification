import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../email/email.service';
import { generateOtp } from './utils/otp';
import { HashService } from './hash.service';
import { PrismaService } from '../prisma.service';
import { RegisterDTO } from './DTO/register.dto';
import { Request, Response } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private emailService: MailerService,
    private hashService: HashService,
  ) {}

  async create(registerDTO: RegisterDTO, res: Response, req: Request) {
    let user: any = {};
    user.name = registerDTO.name;
    user.email = registerDTO.email;
    // user.department = createAccountDto.department;
    // user.phone_number = createAccountDto.phone_number;
    // user.level = createAccountDto.level;
    const code = generateOtp();
    user.verification_code = code;
    const hash = await this.hashService.createPasswordHash(
      registerDTO.password,
    );
    user.password = hash;

    // const wallet = await this.walletService.create();
    // user.wallet_id = wallet.id;
    // delete createAccountDto.wallet_id;

    await this.prismaService.user
      .create({
        data: {
          ...user,
          is_verified: true
        },
      })
      .then(async (account) => {
        const emailResult = await this.emailService.sendConfirmationEmail(
          registerDTO.email,
          code,
          `${req.protocol}://${req.get('host')}`,
        );
        if (!emailResult)
          throw new InternalServerErrorException('Verification email not sent');
        res.status(201).json({
          ...account,
          password: undefined,
          verification_code: undefined,
        });
      })
      .catch((err) => {
        let message;
        // this.walletService.remove(wallet.id);
        if (err.code == 'P2002') {
          message = 'Account Already Exists! Enter a valid Email/Username.';
          // res.status(409).json({ message: message, error: err });
          console.log(err);
          
          throw new ConflictException(message);
        } else {
          message = 'Internal server Error!';
          console.log(err.message);
          throw new InternalServerErrorException(message);
        }
      });
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });

    if (user && (await this.hashService.verifyPassword(pass, user.password))) {
      const { password, ...result } = user;
      const payload = { email: user.email, sub: user.id };
      if (result.is_verified)
        return {
          access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
      else
        throw new UnauthorizedException(
          'Account not verified! Click forgot password to verify email!',
        );
      // return result;
    }
    throw new UnauthorizedException('Invalid username or password');
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async confirmEmail(email: string, code: string) {
    const account = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    const newCode = generateOtp();
    if (!account) throw new NotFoundException('User does not exist!');

    if (account.verification_code === code) {
      const res = await this.prismaService.user.update({
        where: { id: account.id },
        data: {
          is_verified: account.verification_code === code,
          verification_code: newCode,
        },
      });
      return {
        status: 'success',
        account: { id: account.id, email: account.email },
        code: newCode,
      };
    }
    throw new BadRequestException(
      account.is_verified
        ? 'Account already verified!'
        : 'Invalid verification code!',
    );
  }

  async sendForgotPassword(email: string, hostname: string) {
    const account = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    const otp = generateOtp();
    if (!account) throw new NotFoundException('User does not exist!');
    try {
      const res = this.prismaService.user.update({
        where: { id: account.id },
        data: {
          verification_code: otp,
        },
      });
      return this.emailService.sendForgotPasswordEmail(email, otp, hostname);
    } catch (err) {
      throw new BadRequestException('An unknown error Occured!');
    }
  }

  async resendConfirmationEmail(email: string, hostname) {
    const account = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (!account) throw new NotFoundException('User does not exist!');
    return this.emailService.sendConfirmationEmail(
      email,
      `${account.verification_code}`,
      hostname,
    );
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const account = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (!account) throw new NotFoundException('User does not exist!');

    // Verify OTP directly without calling confirmEmail
    if (account.verification_code !== otp) {
      throw new BadRequestException('Invalid verification code!');
    }

    const hash = await this.hashService.createPasswordHash(newPassword);
    const newCode = generateOtp();

    // Update everything in one operation
    return this.prismaService.user.update({
      where: { id: account.id },
      data: {
        password: hash,
        verification_code: newCode,
        is_verified: true, // Ensure account is verified
      },
    });
  }

  async checkIn(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User does not exist!');

    // chech if it's past 24 hours and less than 48 hours since last check-in
    if (
      (user.lastCheckin as Date) <= new Date(Date.now() - 24 * 60 * 60 * 1000)
    ) {
      // chech if it's past 48 hours and less than 48 hours since last check-in
      if (
        (user.lastCheckin as Date) < new Date(Date.now() - 48 * 60 * 60 * 1000)
      ) {
        return this.prismaService.user.update({
          where: { id: userId },
          data: {
            streak: { increment: 1 },
            lastCheckin: new Date(),
          },
        });
      } else {
        return this.prismaService.user.update({
          where: { id: userId },
          data: {
            streak: { set: 1 },
            lastCheckin: new Date(),
          },
        });
      }
    } else throw new ConflictException('Check-in already done for today!');
  }
}
