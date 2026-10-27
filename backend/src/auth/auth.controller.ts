import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import type{ Response } from 'express';
import type{ Request } from 'express';
import { GoogleAuthGuard } from './google-auth.guard.js';

 // type interface for google profile
type GoogleProfile = {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
    await this.authService.register(registerDto);

    return {
      message: 'Registration successful. Please log in.',
    };
    }
        catch (error) {
          throw new InternalServerErrorException('An error occurred during registration. Please try again later.');
        }
    
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response,) {
    try {
    const userDetails = await this.authService.login(loginDto);
    const {accessToken, refreshToken,user} = userDetails;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    return {
      message: 'User logged in successfully',
      user,
      accessToken,
    };
  }
  catch (error) {
    throw new InternalServerErrorException('An error occurred during login. Please try again later.');
  }}
@Post('logout')
async logout(@Res({ passthrough: true }) res: Response) {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
})
return({
  message: 'User logged out successfully',
});
  }
  catch (error) {
    console.error('Error during logout:', error);
  throw new InternalServerErrorException('An error occurred during logout. Please try again later.');
  }
}
@Post('refresh-token')
@HttpCode(HttpStatus.OK)
async refreshAccessToken(@Req() req: Request) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedException('No refresh token provided');
  }

  return this.authService.refreshAccessToken(refreshToken);
}

@Get('google')
@UseGuards(GoogleAuthGuard)
googleLogin() {};

@Get('google/callback')
@UseGuards(GoogleAuthGuard)
 async googleLoginRedirect(@Req() req:Request, @Res({ passthrough: true }) res: Response) {
  try{
  const googleUser= req.user as GoogleProfile | undefined
  if (!googleUser)
  {
    throw new UnauthorizedException("No google profile found try again")
  }
   const googleRefreshToken = await this.authService.googleService({
    google_id: googleUser.googleId,
    email: googleUser.email,
    username: googleUser.name,
  });
  
    res.cookie('refreshToken', googleRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    return {
      message: 'User logged in successfully'}}
  catch (error) {
    console.error('Error during logout:', error);
  throw new InternalServerErrorException('An error occurred. Please try again later.');
  }
}}