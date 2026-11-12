import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { AuthModel } from './auth.model.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { TokenService } from './token.service.js';

type GoogleUserData = {
  google_id: string;
  email: string;
  username: string;
}; 

@Injectable()
export class AuthService {
  constructor(
    private readonly authModel: AuthModel,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const { email, password, name } = registerDto;

    if (
      !email?.trim() ||
      !password ||
      !name?.trim()
    ) {
      throw new BadRequestException(
        'Name, email and password are required',
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    const existingUser =
      await this.authModel.findUserByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException(
        'An account with this email already exists',
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.authModel.createUser(
      normalizedEmail,
      hashedPassword,
      normalizedName,
    );
   }


  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    if (!email?.trim() || !password) {
      throw new BadRequestException(
        'Email and password are required',
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user =await this.authModel.findUserByEmail(normalizedEmail);
//fetch user from db, if user isnt there send error, if user password is empty send error, if password is incorrect send error
      if (!user || !user.password) {
        throw new UnauthorizedException(
          'Invalid email or password',
        );
      }

      const isMatch = await bcrypt.compare(
        password,
        user.password,
      );

      if (!isMatch) {
        throw new UnauthorizedException(
          'Invalid email or password',
        );
      }
     const accessToken=
      await this.tokenService.generateAccessToken(user.id,user.email);
      const refreshToken= await this.tokenService.generateRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
      user:{
      id: user.id,
      email: user.email,
      name: user.name,
      }
      
    };}

    async refreshAccessToken(refreshToken:string){
      let payload:{sub:number};
      try{
        payload=await this.tokenService.verifyRefreshToken(refreshToken);
      }
      catch(error){
        throw new UnauthorizedException('Invalid refresh token');
      }
        const user= await this.authModel.fetchUserById(payload.sub);
        if(!user){
          throw new UnauthorizedException('User not found');
        }
        const accessToken= await this.tokenService.generateAccessToken(user.id,user.email);
        return {
          accessToken}}

    async googleService({google_id,email,username}: GoogleUserData){
    const existinguser = await this.authModel.findUserByGoogleId(google_id)
      if (existinguser){
         const refreshToken= await this.tokenService.generateRefreshToken(existinguser.id)
        return refreshToken
      }
      const localUser= await this.authModel.findUserByEmail(email)
      if (localUser){
        const updatedLocalUser= await this.authModel.updateLocalUser(google_id,email,username)
        if(!updatedLocalUser){throw new UnauthorizedException('Unable to link your Google account');}
        const refreshToken = await this.tokenService.generateRefreshToken(updatedLocalUser.id)
        return refreshToken
      }
      const newGoogleUser= await this.authModel.createGoogleUser(google_id,email,username)
      if(!newGoogleUser){throw new UnauthorizedException('Unable to link your Google account');}
      const refreshToken= await this.tokenService.generateRefreshToken(newGoogleUser.id)
      return refreshToken}}
