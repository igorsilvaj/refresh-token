import { client } from '../prisma/client'
import bcrypt from 'bcrypt'
import { GenerateRefreshToken } from '../helpers/generateRefreshToken';
import { GenerateToken } from '../helpers/generateToken';

interface IUser {
  name: string;
  username: string;
  password: string;
}

export class CreateUserService {
  async execute({ name, username, password }: IUser) {
    const user = await client.user.findFirst({
      where: { username }
    })

    if (user) {
      throw new Error("User already registered")
    }

    const passHash = await bcrypt.hash(password, 10)

    const newUser = await client.user.create({
      data: {
        name,
        username,
        password: passHash
      }
    })

    const generateToken = new GenerateToken()
    const token = await generateToken.execute(newUser.id)

    const generateRefreshToken = new GenerateRefreshToken();
    await generateRefreshToken.execute(newUser.id);

    return {id: newUser.id, name: newUser.name, token};
  }
}

export class AuthenticateUserService {
  async execute({ username, password }: Partial<IUser>) {
    const user = await client.user.findFirst({
      where: {
        username
      }
    })

    if (!user) {
      throw new Error("Incorrect username or password")
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new Error("Incorrect username or password")
    }

    const generateToken = new GenerateToken()
    const token = await generateToken.execute(user.id)

    await client.refreshToken.deleteMany({
      where: {
        userId: user.id
      }
    })

    const generateRefreshToken = new GenerateRefreshToken();
    await generateRefreshToken.execute(user.id);

    return { token }
  }
}

export class ListUserService {
  async execute() {
    const users = await client.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
      },
    })
    return users
  }
}