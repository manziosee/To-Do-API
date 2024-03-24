import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { authentication, random } from '../helpers';
import jwt from 'jsonwebtoken';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if (!user) {
      return res.sendStatus(400);
    }
    const expectedHash = authentication(user.authentication.salt, password);
    
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

    res.cookie('OSEE-AUTH', token, { domain: 'localhost', path: '/', httpOnly: true });

    return res.status(200).json({ token }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
  
    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const newUser = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    const token = jwt.sign({ userId: newUser._id }, 'your_secret_key', { expiresIn: '1h' });

    return res.status(200).json({ token }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
