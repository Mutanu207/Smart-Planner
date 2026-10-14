import {Injectable, NestMiddleware} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import{ Request,Response,NextFunction} from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor( private readonly jwtService:JwtService) {}
    async use( //function to check if the user is authenticated, the use() method is called to check if the user is authenticated before allowing access to protected routes.
        req:Request, //request object, which contains information about the incoming HTTP request, such as headers, query parameters, and body data.
        res:Response, //response object, which is used to send the HTTP response back to the client.
        next:NextFunction //function to call the next middleware in the chain.
    ){
        const authHeader= req.headers.authorization //get the authorization header from the request
        if (!authHeader || !authHeader.startsWith('Bearer ')) { //check if the authorization header is present and starts with "Bearer "
            return res.status(401).json({ message: 'Unauthorized user please sign in to continue' }) //if not, return a 401 Unauthorized response
        }
        const token= authHeader.split(' ')[1] //extract the token from the authorization header
        try{
            const decoded = await this.jwtService.verifyAsync(token);
            (req as Request & { user?: typeof decoded }).user = decoded; //attach the decoded user information to the request object
            next() //call the next middleware in the chain
        }
        catch{
            return res.status(401).json({ message: 'Invalid token' }) //if the token is invalid, return a 401 Unauthorized response
        }

    }
    
}