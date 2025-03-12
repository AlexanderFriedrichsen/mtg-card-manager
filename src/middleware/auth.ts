import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'Authorization header missing' });
      return;
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Attach userId to request object
    req.userId = decoded.userId;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};