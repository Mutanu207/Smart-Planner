
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

export interface UserRecord {
  email: string;
  name: string;
  password: string | null;
  id:number;
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
    const result = await this.databaseService.query(
      `SELECT email, name , password, id
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
  ): Promise <void> {
    await this.databaseService.query(
      `INSERT INTO users (email, password, name)
       VALUES ($1, $2, $3)`,
      [email, hashedPassword, name],
    );}

 async fetchUserById(id: number): Promise<fetchUserById | undefined> {
    const result = await this.databaseService.query(
      `SELECT id, email
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [id],
    );

    return result.rows[0] as fetchUserById | undefined;}

async findUserByGoogleId(google_id:string):Promise <existingGoogleUser | undefined >{

    const result= await this.databaseService.query(
      `SELECT id
       FROM users
       WHERE google_id = $1
       LIMIT 1`,
      [google_id],
    );
    return result.rows[0] as existingGoogleUser | undefined
}

async updateLocalUser(
  google_id: string,
  email: string,
  username: string,
): Promise<updatedUser | undefined> {
  
    const result = await this.databaseService.query(
      `UPDATE users
       SET google_id = $1,
           name = $2
       WHERE email = $3
       RETURNING id`,
      [google_id, username, email],
    );

    return result.rows[0] as updatedUser | undefined;}

 async createGoogleUser(
     google_id: string,
      email: string,
     username: string,
 ) : Promise < newGoogleUser | undefined >{
    const result = await this.databaseService.query(
      ` INSERT INTO users(google_id,email,name)
      VALUES($1,$2,$3)
      RETURNING id`,
      [google_id,email,username]
    )
    return result.rows[0] as newGoogleUser | undefined
  }
}