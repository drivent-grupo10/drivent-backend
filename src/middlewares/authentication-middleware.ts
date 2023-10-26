import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { unauthorizedError } from '@/errors';
import { authenticationRepository } from '@/repositories';
import { authenticationService } from '@/services';

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  if (!authHeader) throw unauthorizedError();

  const token = authHeader.split(' ')[1];
  if (!token) throw unauthorizedError();

 
  if(token[0] == 'g' && token[1] == 'h' && token[2] == '0') {
    const userGitHub = await authenticationService.urlUserGithubPart(token);
    if(userGitHub){
      const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;      
    }
  }  

  const session = await authenticationRepository.findSession(token);
  if (!session) throw unauthorizedError();

  req.userId = session.userId;
  next();
}

export type AuthenticatedRequest = Request & JWTPayload;

type JWTPayload = {
  userId: number;
};
