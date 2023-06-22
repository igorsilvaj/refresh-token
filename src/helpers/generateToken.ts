import { sign } from "jsonwebtoken";

export class GenerateToken {
  async execute(userId: string) {
    const token = sign({ subject: userId }, process.env.JWT_TOKEN, { expiresIn: "15m" })
    return token
  }
}