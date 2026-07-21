import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { config } from '../config/env';
import { AppError } from '../utils/appError';
import { IUser } from '../models/User';

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(name: string, email: string, password: string): Promise<{ user: IUser; token: string; refreshToken: string }> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new AppError('Email is already registered', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.userRepo.create({ name, email, passwordHash });
    const token = this.generateToken(user._id.toString());
    const refreshToken = this.generateRefreshToken(user._id.toString());

    return { user, token, refreshToken };
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string; refreshToken: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user._id.toString());
    const refreshToken = this.generateRefreshToken(user._id.toString());

    return { user, token, refreshToken };
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  public generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });
  }

  public generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenExpiresIn as any,
    });
  }
}
