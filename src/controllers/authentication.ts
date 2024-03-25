import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { authentication, random } from '../helpers';
import jwt from 'jsonwebtoken';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/;
  return passwordRegex.test(password);
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if (!user || !user.authentication) {
      return res.status(400).json({ error: "Invalid email or password." });
    }
    const { salt, password: storedPassword } = user.authentication;
    if (!salt || !storedPassword) {
      return res.status(400).json({ error: "Invalid email or password." });
    }
    const expectedHash = authentication(salt, password);
    if (storedPassword !== expectedHash) {
      return res.status(403).json({ error: "Invalid email or password." });
    }
    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
    res.cookie('OSEE-AUTH', token, { domain: 'localhost', path: '/', httpOnly: true });
    return res.status(200).json({ user: { email: user.email, id: user._id, username: user.username }, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: "Password must be at least 10 characters long and contain at least one letter and one digit." });
    }
    if (username.length > 50) {
      return res.status(400).json({ error: "Username must be at most 50 characters long." });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
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
    return res.status(201).json({ user: { email: newUser.email, id: newUser._id, username: newUser.username }, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
};
