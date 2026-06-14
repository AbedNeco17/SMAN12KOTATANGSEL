const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../../../server');
const AdminUser = require('../../models/AdminUser');

// Mock AdminUser model
jest.mock('../../models/AdminUser');

// Mock DB connection config to prevent actual connection attempt in server.js
jest.mock('../../config/database', () => ({
  query: jest.fn(),
  getConnection: jest.fn().mockResolvedValue({
    release: jest.fn(),
  }),
}));

const JWT_SECRET = process.env.JWT_SECRET || 'sman12-secret-key-change-in-production';

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        username: 'admin',
        password: hashedPassword,
        nama_lengkap: 'Administrator',
        role: 'superadmin',
      };

      AdminUser.findByUsername.mockResolvedValueOnce(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login berhasil');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe('admin');
    });

    it('should fail when username or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username dan password wajib diisi');
    });

    it('should fail with nonexistent username', async () => {
      AdminUser.findByUsername.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'unknown', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username atau password salah');
    });

    it('should fail with incorrect password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        username: 'admin',
        password: hashedPassword,
      };

      AdminUser.findByUsername.mockResolvedValueOnce(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username atau password salah');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return logout success', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout berhasil');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return profile data for authenticated user', async () => {
      const mockProfile = {
        id: 1,
        username: 'admin',
        email: 'admin@sman12.sch.id',
        nama_lengkap: 'Administrator',
        role: 'superadmin',
      };

      AdminUser.findById.mockResolvedValueOnce(mockProfile);

      const token = jwt.sign(
        { id: mockProfile.id, username: mockProfile.username, role: mockProfile.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockProfile);
    });

    it('should deny access when token is missing', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Akses ditolak. Token tidak ditemukan.');
    });

    it('should deny access when token is invalid', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Token tidak valid atau sudah kedaluwarsa.');
    });
  });
});
