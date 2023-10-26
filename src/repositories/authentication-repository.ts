import { Prisma } from '@prisma/client';
import { prisma } from '@/config';
import axios from "axios";

export type AccessTokenParams = {
  code: string;
  client_id: string;
  client_secret: string;
}


async function createSession(data: Prisma.SessionUncheckedCreateInput) {
  return prisma.session.create({
    data,
  });
}


async function findSession(token: string) {
  return prisma.session.findFirst({
    where: {
      token,
    },
  });
}

async function accessTokenGithubRepo(params: AccessTokenParams, GITHUB_ACCESS_TOKEN_URL: string) {
  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return data;
}

async function getUserGithubRepo(token: string, GITHUB_USER_URL: string) {
  const response = await axios.get(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response;
}

export const authenticationRepository = {
  createSession,
  findSession,
  accessTokenGithubRepo,
  getUserGithubRepo
};
