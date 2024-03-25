import express from 'express';
import jwt from 'jsonwebtoken';
import { merge, get } from 'lodash';
import { getUserBySessionToken } from '../db/users';

const JWT_SECRET = 'my_secure_secret_key_for_jwt_tokens'; 

export interface AuthenticatedRequest extends express.Request {
    userId: string; 
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies['jwt'];

    if (!token) {
      return res.sendStatus(403);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Attach identity to the request
    merge(req, { identity: { _id: decoded.userId } });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as unknown;

    if (typeof currentUserId !== 'string') {
      return res.sendStatus(400);
    }

    if (currentUserId !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
