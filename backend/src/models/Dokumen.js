const db = require('../config/database');

const Dokumen = {
  findAll: async ({ page = 1, limit = 10, tipe }) => {
    let query = 'SELECT d.*, a.nama_lengkap AS author_name FROM dokumen d LEFT JOIN admin_users a ON d.author_id = a.id';
    let countQuery = 'SELECT COUNT(*) AS total FROM dokumen d';
    const conditions = [];
    const params = [];

    if (tipe) {
      conditions.push('d.tipe = ?');
      params.push(tipe);
    }

    if (conditions.length > 0) {
      const where = ' WHERE ' + conditions.join(' AND ');
      query += where;
      countQuery += where;
    }

    query += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';
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
      'SELECT d.*, a.nama_lengkap AS author_name FROM dokumen d LEFT JOIN admin_users a ON d.author_id = a.id WHERE d.id = ?',
      [id]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const { judul, deskripsi, file_path, tipe, ukuran_file, author_id } = data;
    const [result] = await db.query(
      'INSERT INTO dokumen (judul, deskripsi, file_path, tipe, ukuran_file, author_id) VALUES (?, ?, ?, ?, ?, ?)',
      [judul, deskripsi || null, file_path, tipe || 'lainnya', ukuran_file || 0, author_id || null]
    );
    return { id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];

    ['judul', 'deskripsi', 'file_path', 'tipe', 'ukuran_file'].forEach((key) => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await db.query(`UPDATE dokumen SET ${fields.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM dokumen WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = Dokumen;
