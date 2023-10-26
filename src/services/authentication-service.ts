import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { invalidCredentialsError } from '@/errors';
import { authenticationRepository, userRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import qs from "query-string";
import {userService} from "@/services/users-service";



async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}


async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await authenticationRepository.createSession({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}


export async function singInGithub(code: string) {
  const token = await urlAccessTokenGithubPart(code);
  //console.log('token em service', token)
  const user = await urlUserGithubPart(token);
  //console.log('qm é user:', user)
  const emailDuplicated = await userService.validateUniqueEmailOrFail(user.email !== null ? user.email : user.login);
  
  if(emailDuplicated){
    await authenticationRepository.createSession({
      token,
      userId: emailDuplicated.id,
    });
    return {
      user: {
        email: emailDuplicated.email,
        id: emailDuplicated.id
      },
      token,
    };
  }

  const creatUserGithub = await userService.createUser({email: user.email !== null ? user.email : user.login, password: user.id});
  await authenticationRepository.createSession({
    token,
    userId: creatUserGithub.id,
  });
  return {
    user: {
      email: creatUserGithub.email, 
      id: creatUserGithub.id
    },
    token,
  };
}


async function urlAccessTokenGithubPart(code: string) {
  const GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

  const { CLIENT_ID, CLIENT_SECRET } = process.env;
  const params = {
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  }

  const data: any = await authenticationRepository.accessTokenGithubRepo(params, GITHUB_ACCESS_TOKEN_URL)
 //console.log('data em service', data)
  const { access_token } = qs.parse(data);
  return Array.isArray(access_token) ? access_token.join("") : access_token;
}


export async function urlUserGithubPart(token: string) {
  const GITHUB_USER_URL = "https://api.github.com/user";
  
  const response: any = await authenticationRepository.getUserGithubRepo(token, GITHUB_USER_URL);
  return response.data;
}



export type SignInParams = Pick<User, 'email' | 'password'>;

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

export const authenticationService = {
  signIn,
  singInGithub,
  urlUserGithubPart
};
