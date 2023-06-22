import { Request, Response } from "express";
import { AuthenticateUserService, CreateUserService, ListUserService } from "../services/User.service";

export class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, username, password } = req.body
    const createUser = new CreateUserService();
    const user = await createUser.execute({
      name,
      username,
      password
    });
    return res.status(201).json(user)
  }
}

export class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    const { username, password } = req.body
    const authUser = new AuthenticateUserService();
    const token = await authUser.execute({
      username,
      password
    })

    return res.json(token)
  };
}

export class ListUserController {
  async handle(_req: Request, res: Response) {
    const listUsers = new ListUserService();
    const users = await listUsers.execute();
    return res.json(users)
  };
}