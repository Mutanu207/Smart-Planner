
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

export interface UserRecord {
  email: string;
  name: string;
  password:string;
  id:number;
}

export interface CreatedUser {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

@Injectable()
export class AuthModel {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async findUserByEmail(
    email: string,
  ): Promise<UserRecord | undefined> {
    const result = await this.databaseService.query(
      `SELECT email, name , password
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email],
    );

    return result.rows[0] as UserRecord | undefined;
  }

  async createUser(
    email: string,
    hashedPassword: string,
    name: string,
  ): Promise<CreatedUser> {
    const result = await this.databaseService.query(
      `INSERT INTO users (email, password, name)
       VALUES ($1, $2, $3)`,
      [email, hashedPassword, name],
    );

    return result.rows[0] as CreatedUser;
  }
}
