
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
export interface existingGoogleUser {
  id:number;
}
export interface updatedUser{
  id:number;
}
export interface newGoogleUser {
  id:number;
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
async findUserByGoogleId(google_id:string):Promise <existingGoogleUser | undefined >{
  try{
    const result= await this.databaseService.query(
      `SELECT id
       FROM users
       WHERE google_id = $1
       LIMIT 1`,
      [google_id],
    );
    return result.rows[0] as existingGoogleUser | undefined
} catch (error) {
    throw error;
  }
}

async updateLocalUser(
  google_id: string,
  email: string,
  username: string,
): Promise<updatedUser | undefined> {
  try {
    const result = await this.databaseService.query(
      `UPDATE users
       SET google_id = $1,
           name = $2
       WHERE email = $3
       RETURNING id`,
      [google_id, username, email],
    );

    return result.rows[0] as updatedUser | undefined;
  } catch (error) {
    throw error;
  }
}
 async createGoogleUser(
     google_id: string,
      email: string,
     username: string,
 ) : Promise < newGoogleUser | undefined >{
  try{
    const result = await this.databaseService.query(
      ` INSERT INTO users(google_id,email,name)
      VALUES($1,$2,$3)
      RETURNING id`,
      [google_id,email,username]
    )
    return result.rows[0] as newGoogleUser | undefined
  }
  catch (error) {
    throw error;
  }
 }
 }