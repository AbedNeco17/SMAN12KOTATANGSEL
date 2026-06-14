const db = require('../config/database');

const Galeri = {
  findAll: async ({ page = 1, limit = 12, kategori }) => {
    let query = 'SELECT g.*, a.nama_lengkap AS author_name FROM galeri g LEFT JOIN admin_users a ON g.author_id = a.id';
    let countQuery = 'SELECT COUNT(*) AS total FROM galeri g';
    const conditions = [];
    const params = [];

    if (kategori) {
      conditions.push('g.kategori = ?');
      params.push(kategori);
    }

    if (conditions.length > 0) {
      const where = ' WHERE ' + conditions.join(' AND ');
      query += where;
      countQuery += where;
    }

    query += ' ORDER BY g.created_at DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;

    const [rows] = await db.query(query, [...params, limit, offset]);
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT g.*, a.nama_lengkap AS author_name FROM galeri g LEFT JOIN admin_users a ON g.author_id = a.id WHERE g.id = ?',
      [id]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const { judul, deskripsi, gambar, kategori, author_id } = data;
    const [result] = await db.query(
      'INSERT INTO galeri (judul, deskripsi, gambar, kategori, author_id) VALUES (?, ?, ?, ?, ?)',
      [judul, deskripsi || null, gambar, kategori || 'kegiatan', author_id || null]
    );
    return { id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];

    ['judul', 'deskripsi', 'gambar', 'kategori'].forEach((key) => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await db.query(`UPDATE galeri SET ${fields.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM galeri WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = Galeri;
