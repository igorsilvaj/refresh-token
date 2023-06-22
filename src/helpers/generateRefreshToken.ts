import dayjs from "dayjs";
import { client } from "../prisma/client";

export class GenerateRefreshToken {
  async execute(userId: string) {
    const expiresIn = dayjs().add(30, 'days').unix()

    const generateRefreshToken = await client.refreshToken.create({
      data: {
        userId,
        expiresIn
      }
    })
    return generateRefreshToken
  }
}