import { authenticationService, SignInParams } from '@/services';
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  
}

export async function signInWithGithub (req: Request, res: Response) {
  const code = req.body.code as string;
    const result = await authenticationService.singInGithub(code);
    res.send(result);
}