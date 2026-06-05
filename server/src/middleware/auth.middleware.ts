import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.utils';
import { School } from '../models/school.model';

export interface AuthRequest extends Request {
  school?: any;
  schoolId?: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (token === 'null' || token === 'undefined') {
        throw new Error('Malformed token string');
      }

      const decoded = verifyToken(token);

      // Check if school still exist in DB
      const school = await School.findById(decoded.id).select('-password');

      if (!school) {
        res.status(401).json({
          message: 'Not authorized, school not found.',
        });
        return;
      }

      // Attach the school object and the schoolId string to the request
      req.school = school;
      req.schoolId = school._id.toString();

      next();
      return;
    } catch (err) {
      console.error('Auth middleware error:', err);
      res.status(401).json({
        message: 'Not authorized, token failed.',
      });
      return;
    }
  }
};
