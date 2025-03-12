import express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); 
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email }
          ]
        }
      });
      
      if (existingUser) {
        res.status(400).json({ message: 'Username or email already exists' });
        return;
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create the user
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword
        }
      });
      
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      // Return user info and token (don't include password)
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        token
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      
      // Find the user
      const user = await prisma.user.findUnique({
        where: { username }
      });
      
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      
      // Verify password
      const passwordValid = await bcrypt.compare(password, user.password);
      
      if (!passwordValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
      
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      // Return user info and token
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        token
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
};


// export const showUserProfile = async (req: express.Request, res: express.Response) => {
//     try {
//         const userData = await prisma.user. //just return the user
//         res.json(userData);
//     } catch (error) {
//         console.error('Error fetching user data', error);
//         res.status(500).json({ message: 'Error fetching user data' });
//     }    
// }