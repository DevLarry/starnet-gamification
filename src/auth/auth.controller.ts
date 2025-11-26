import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Res,
  Session,
  Query,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './DTO/login.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { generateOtp } from './utils/otp';
import * as bcrypt from 'bcrypt';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma.service';
import { RegisterDTO } from './DTO/register.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  @ApiOperation({
    summary: 'User Registration',
    description: 'Register a new user account',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid registration data.',
  })
  @ApiResponse({
    status: 409,
    description: 'Account already exists with the provided email',
  })
  @ApiBody({ type: RegisterDTO })
  @Post('register')
  async register(
    @Body() registerDTO: RegisterDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.authService.create(registerDTO, res, req);
  }

  // @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'User Login',
    description: 'Login to the application using email and password',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully logged in.',
    schema: {
      type: 'object',
      default: {
        access_token: `auth_token`,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  @ApiBody({ type: LoginDTO })
  @Post()
  @Post('login')
  async login(
    @Session() session,
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginDTO,
  ) {
    let token = this.authService.signIn(body.username, body.password);
    session.token = (await token).access_token;
    res.cookie('access_token', (await token).access_token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    // return token;
    res.json(await token);
  }

  @ApiOperation({
    summary: 'Confirm Email Code',
    description:
      'Confirm user email using the confirmation code sent to email, returns a code property in the response which is used for password reset',
  })
  @ApiResponse({
    status: 200,
    description: 'Email confirmed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid confirmation code or email.',
  })
  @Get('confirm-email')
  @ApiQuery({ name: 'code', required: true, type: String })
  @ApiQuery({ name: 'email', required: true, type: String })
  confirmEmail(@Query('code') code, @Query('email') email) {
    return this.authService.confirmEmail(email, code);
  }

  @ApiOperation({
    summary: 'Resend Confirmation Email',
    description: 'Resend the email confirmation code to the user email',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirmation email resent successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid email.',
  })
  @ApiQuery({ name: 'email', required: true, type: String })
  @Get('resend-confirmation-email')
  @ApiQuery({ name: 'email', required: true, type: String })
  resendConfirmationEmail(@Query('email') email, @Req() req) {
    return this.authService.resendConfirmationEmail(
      email,
      `${req.protocol}://${req.get('host')}`,
    );
  }

  @ApiOperation({
    summary: 'Forgot Password',
    description: 'Send a password reset code to the user email',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset code sent successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid email.',
  })
  @Get('forgot-password')
  @ApiQuery({ name: 'email', required: true, type: String })
  forgotPassword(@Query('email') email, @Req() req) {
    return this.authService.sendForgotPassword(
      email,
      `${req.protocol}://${req.get('host')}`,
    );
  }

  @ApiOperation({
    summary: 'Reset Password',
    description:
      '# Reset user password using the OTP sent to email \n Here you send back the `code` property of the data returned from the confirmEmail endpoint as OTP in the body along with the new password',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid OTP or email.',
  })
  @ApiQuery({ name: 'email', required: true, type: String })
  @Post('reset-password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
        otp: { type: 'string' },
      },
    },
  })
  async resetPassword(
    @Body() body: { email: string; password: string; otp: string },
  ) {
    const { email, password, otp } = body;
    console.log(password, otp, email);

    // const res = await this.authService.resetPassword(email, otp, password);
    // if (res) return res;
    const res = await this.authService.confirmEmail(email, otp);
    const hash = await bcrypt.hash(password, 10);
    if (res.status === 'success') {
      return this.prismaService.user.update({
        where: { id: res.account.id },
        data: {
          password: hash,
          verification_code: generateOtp(),
        },
      });
    }
    throw new BadRequestException('Email Coonfirmation failed!');
  }

  // @Get()
  // @UseGuards(AuthGuard)
  // verify(@Request() req) {
  //   return req.user;
  // }

  @ApiOperation({
    summary: 'Get User Profile',
    description: 'Retrieve the profile of the currently authenticated user',
  })
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    // console.log(req.user);
    return req.user;
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Logout the current user and destroy the session',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully.',
  })
  @Get('logout')
  logout(@Session() session) {
    session.destroy();
  }

  @ApiOperation({
    summary: 'User Check-In',
    description: 'Perform a daily check-in for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'User checked in successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Check-in already done for today.',
  })
  @UseGuards(AuthGuard)
  @Get('check-in')
  checkIn(@Req() req) {
    return this.authService.checkIn(req.user.id);
  }
}
