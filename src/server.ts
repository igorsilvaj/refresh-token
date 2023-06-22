import "express-async-errors";
import express, { NextFunction, Request, Response } from 'express';
import router from './routes';

const PORT = process.env.NODEPORT ?? 3001;

const app = express();

app.use(express.json());

app.use(router);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({
    status: 'Error',
    message: error.message,
  });
});

app.listen(PORT, () => console.log('Running on', PORT));