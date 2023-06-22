import dayjs, { ManipulateType } from "dayjs";
import { client } from "../prisma/client";

export class GenerateRefreshToken {
  async execute(userId: string) {
    const exp = process.env.REFRESH_TOKEN_EXP.split(',')
    
    const expiresIn = dayjs().add(+exp[0] || 30, exp[1] as ManipulateType || 'days').unix()

    const generateRefreshToken = await client.refreshToken.create({
      data: {
        userId,
        expiresIn
      }
    })
    return generateRefreshToken
  }
}