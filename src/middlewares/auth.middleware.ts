import dayjs from 'dayjs'
import { NextFunction, Request, Response } from 'express'
import { decode, verify } from 'jsonwebtoken'
import { client } from '../prisma/client'
import { GenerateToken } from '../helpers/generateToken'

export type Auth = Request & {
  auth: {
    email: string
  }
}

class ExpiredTokenError extends Error {
  token: string;

  constructor(token: string) {
    const message = 'Token expired';
    super(message);
    this.name = 'ExpiredTokenError';
    this.token = token;
  }
}

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      message: "Token is missing"
    })
  }

  try {
    const decodedToken = decode(authToken)
    const validRefreshToken = await client.refreshToken.findFirst({ where: { userId: decodedToken['subject'] } })

    if (!validRefreshToken) {
      throw new Error("Invalid Refresh Token")
    }

    const expiredToken = dayjs().isAfter(dayjs.unix(decodedToken['exp']))
    const expiredRefreshToken = dayjs().isAfter(dayjs.unix(validRefreshToken.expiresIn))

    if (!expiredToken || expiredRefreshToken) {
      // Fluxo normal caso o token de sessão não esteja expirado.
      // Verifica se o token de sessão ou o refresh token estão expirados.
      // Se o refresh token estiver expirado, o back-end não fornece um novo token e o usuário deve fazer login novamente.
      verify(authToken, process.env.JWT_TOKEN)
    } else {
      // Se o refresh token não estiver expirado, o back-end fornece um novo token de acesso válido.
      const generateToken = new GenerateToken()
      const token = await generateToken.execute(decodedToken['subject'])
      throw new ExpiredTokenError(token)
    }

    return next();
  }
  catch (err) {
    if (err instanceof ExpiredTokenError) {
      return res.status(401).json({
        message: "Expired Token",
        token: err.token
      })
    }
    
    return res.status(401).json({
      message: "Invalid Token"
    })
  }
}

export default checkAuth
