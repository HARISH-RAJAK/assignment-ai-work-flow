import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';

describe('Auth Endpoints API Integration Tests', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_task_platform_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await User.deleteMany({});
      await mongoose.connection.close();
    }
  });

  const testUser = {
    name: 'Test Engineer',
    email: 'test.engineer@example.com',
    password: 'Password123!',
  };

  it('POST /api/auth/register - should successfully register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user).toHaveProperty('_id');
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data).toHaveProperty('token');
  });

  it('POST /api/auth/login - should authenticate user and return JWT token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('token');
  });

  it('GET /api/auth/me - should return authenticated user profile', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const token = loginRes.body.data.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
  });
});
