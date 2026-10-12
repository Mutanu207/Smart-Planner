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
}
