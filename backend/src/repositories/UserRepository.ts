import { User, IUser } from '../models/User';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async create(userData: { name: string; email: string; passwordHash: string }): Promise<IUser> {
    const user = new User({
      ...userData,
      email: userData.email.toLowerCase(),
    });
    return user.save();
  }
}
