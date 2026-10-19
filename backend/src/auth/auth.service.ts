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

@Injectable()
export class AuthService {
  constructor(
    private readonly authModel: AuthModel,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    try {
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
  catch (error) {
      throw error;
    } }


  async login(loginDto: LoginDto) {
    try {
    const { email, password } = loginDto;

    if (!email?.trim() || !password) {
      throw new BadRequestException(
        'Email and password are required',
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user =
      await this.authModel.findUserByEmail(normalizedEmail);

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
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
      
    };
    }
    catch (error) {
      throw error;
    } }
    async refreshAccessToken(refreshToken:string){
      let payload:{sub:number};
      try{
        payload=await this.tokenService.verifyRefreshToken(refreshToken);
      }
      catch(error){
        throw new UnauthorizedException('Invalid refresh token');
      }
      //second process 
      try{
        const user= await this.authModel.fetchUserById(payload.sub);
        if(!user){
          throw new UnauthorizedException('User not found');
        }
        const accessToken= await this.tokenService.generateAccessToken(user.id,user.email);
        return {
          accessToken}}
      catch(error){
        throw error;
    }
  }
}
