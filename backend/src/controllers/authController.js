const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { sendSuccess, sendError } = require('../utils/helpers');

const JWT_SECRET = process.env.JWT_SECRET || 'sman12-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return sendError(res, 'Username dan password wajib diisi', 400);
    }

    let user;
    try {
      user = await AdminUser.findByUsername(username);
    } catch (dbError) {
      console.warn('DB query failed, using static fallback user:', dbError.message);
      if (username === 'admin') {
        user = {
          id: 1,
          username: 'admin',
          password: '$2a$10$X7UrE5Jx2lDSn.tQqV9vNOViFl7y6HJlMq5C/0RAHInWbKxjnWk2y',
          nama_lengkap: 'Administrator Portal',
          role: 'superadmin'
        };
      } else if (username === 'guru') {
        user = {
          id: 2,
          username: 'guru',
          password: '$2a$10$n8D.73wFw.q/P5H0XJ1O/OWUuqn82E8mGgH5z7M.Xqf6/JtC87E2K',
          nama_lengkap: 'Ana Mukarromah, S.Si., M.Pd',
          role: 'guru'
        };
      } else {
        throw dbError;
      }
    }

    if (!user) {
      return sendError(res, 'Username atau password salah', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Username atau password salah', 401);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
      },
    }, 'Login berhasil');
  } catch (error) {
    console.error('Login error:', error.message);
    sendError(res, 'Terjadi kesalahan server');
  }
};

exports.logout = (req, res) => {
  sendSuccess(res, {}, 'Logout berhasil');
};

exports.getProfile = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User tidak ditemukan', 404);
    }
    sendSuccess(res, { data: user });
  } catch (error) {
    console.error('Profile error:', error.message);
    sendError(res, 'Terjadi kesalahan server');
  }
};
