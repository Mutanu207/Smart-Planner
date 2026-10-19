
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
 export interface fetchUserById {
  id: number;
  email: string;
}
@Injectable()
export class AuthModel {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async findUserByEmail(
    email: string,
  ): Promise<UserRecord | undefined> {
    try {
    const result = await this.databaseService.query(
      `SELECT email, name , password, id
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email],
    );

    return result.rows[0] as UserRecord | undefined;
  }
      catch (error) {
        throw error;
      }}
  

  async createUser(
    email: string,
    hashedPassword: string,
    name: string,
  ): Promise<CreatedUser> {
    try{
    const result = await this.databaseService.query(
      `INSERT INTO users (email, password, name)
       VALUES ($1, $2, $3)`,
      [email, hashedPassword, name],
    );

    return result.rows[0] as CreatedUser;
  }
  catch (error) {
    throw error;
  }
}
 async fetchUserById(id: number): Promise<fetchUserById | undefined> {
  try {
    const result = await this.databaseService.query(
      `SELECT id, email
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [id],
    );

    return result.rows[0] as fetchUserById | undefined;
  }
  catch (error) {
    throw error;
  }
}
 }