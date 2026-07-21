import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
import { Task } from '../models/Task';

describe('Task Endpoints API Integration Tests', () => {
  let token: string;
  let taskId: string;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_task_platform_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    await User.deleteMany({});
    await Task.deleteMany({});

    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Task Tester',
      email: 'task.tester@example.com',
      password: 'Password123!',
    });

    token = registerRes.body.data.token;
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await User.deleteMany({});
      await Task.deleteMany({});
      await mongoose.connection.close();
    }
  });

  it('POST /api/tasks - should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Uppercase Benchmark Task',
        inputText: 'hello ai world',
        operationType: 'uppercase',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.task).toHaveProperty('_id');
    expect(res.body.data.task.status).toBe('Pending');
    taskId = res.body.data.task._id;
  });

  it('GET /api/tasks - should retrieve list of tasks for user', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.tasks)).toBe(true);
    expect(res.body.data.tasks.length).toBeGreaterThan(0);
  });

  it('GET /api/tasks/:id - should retrieve task by id', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.task._id).toBe(taskId);
  });
});
