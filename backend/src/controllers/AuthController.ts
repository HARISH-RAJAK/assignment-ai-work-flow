import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { AuthRequest } from '../middlewares/authMiddleware';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        res.status(400).json({ status: 'error', message: error.details[0].message });
        return;
      }

      const result = await this.authService.register(value.name, value.email, value.password);
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        res.status(400).json({ status: 'error', message: error.details[0].message });
        return;
      }

      const result = await this.authService.login(value.email, value.password);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.getUserById(req.userId!);
      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  };
}
