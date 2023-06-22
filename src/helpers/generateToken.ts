import { sign } from "jsonwebtoken";

export class GenerateToken {
  async execute(userId: string) {
    const exp = process.env.SESSION_TOKEN_EXP
    
    const token = sign({ subject: userId }, process.env.JWT_TOKEN, { expiresIn: exp || "15m" })
    return token
  }
}