import { Request, Response, NextFunction } from 'express';
import { auth } from '../firebase';

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req?.headers?.authorization.startsWith('Bearer ')) {
    try {
      const token = req.headers.authorization.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(token);
      req['currentUser'] = decodedToken;
    } catch (error) {
      console.log(error);
    }
    next();
  }
}
