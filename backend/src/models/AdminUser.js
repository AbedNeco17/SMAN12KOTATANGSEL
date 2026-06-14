const db = require('../config/database');

const AdminUser = {
  findByUsername: async (username) => {
    const [rows] = await db.query('SELECT * FROM admin_users WHERE username = ?', [username]);
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT id, username, email, nama_lengkap, role, created_at FROM admin_users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  updatePassword: async (id, hashedPassword) => {
    const [result] = await db.query('UPDATE admin_users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return result.affectedRows > 0;
  },
};

module.exports = AdminUser;
