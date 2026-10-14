import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(
    userId: number,
    email: string,
  ): Promise<string> {
    return this.jwtService.signAsync({
      sub: userId,
      email,
    });
  }
  async generateRefreshToken( //function to generate a refesh token
    userId: number, //input and we type it to Number 
  ): Promise<string> {
    const refreshSecret = process.env.JWT_REFRESH_SECRET; //the jwt secret

    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not configured'); //check if secret is there
    }

    return this.jwtService.signAsync( //create the refresh token using the jwtService.signAsync() method, which takes a payload and options as arguments. The payload contains the user ID, and the options specify the secret and expiration time for the token.
      {
        sub: userId,
      },
      {
        secret: refreshSecret, // even though acess token settngs was configured in authmodule doing this overrides it when the refresh token is created//
        expiresIn: '7d',
      },
    );
  }
}

