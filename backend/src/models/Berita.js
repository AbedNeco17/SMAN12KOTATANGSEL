const db = require('../config/database');

const Berita = {
  findAll: async ({ page = 1, limit = 10, kategori, status, search }) => {
    let query = 'SELECT b.*, a.nama_lengkap AS author_name FROM berita b LEFT JOIN admin_users a ON b.author_id = a.id';
    let countQuery = 'SELECT COUNT(*) AS total FROM berita b';
    const conditions = [];
    const params = [];

    if (kategori) {
      conditions.push('b.kategori = ?');
      params.push(kategori);
    }
    if (status) {
      conditions.push('b.status = ?');
      params.push(status);
    }
    if (search) {
      conditions.push('(b.judul LIKE ? OR b.konten LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      const where = ' WHERE ' + conditions.join(' AND ');
      query += where;
      countQuery += where;
    }

    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;

    const [rows] = await db.query(query, [...params, limit, offset]);
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT b.*, a.nama_lengkap AS author_name FROM berita b LEFT JOIN admin_users a ON b.author_id = a.id WHERE b.id = ?',
      [id]
    );
    return rows[0] || null;
  },

  findBySlug: async (slug) => {
    const [rows] = await db.query(
      'SELECT b.*, a.nama_lengkap AS author_name FROM berita b LEFT JOIN admin_users a ON b.author_id = a.id WHERE b.slug = ?',
      [slug]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const { judul, slug, konten, thumbnail, kategori, status, author_id } = data;
    const [result] = await db.query(
      'INSERT INTO berita (judul, slug, konten, thumbnail, kategori, status, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [judul, slug, konten, thumbnail || null, kategori || 'berita', status || 'draft', author_id || null]
    );
    return { id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];

    ['judul', 'slug', 'konten', 'thumbnail', 'kategori', 'status'].forEach((key) => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await db.query(`UPDATE berita SET ${fields.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM berita WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  findPublished: async ({ page = 1, limit = 6, kategori }) => {
    let query = 'SELECT id, judul, slug, LEFT(konten, 200) AS deskripsi, thumbnail, kategori, created_at FROM berita WHERE status = "published"';
    let countQuery = 'SELECT COUNT(*) AS total FROM berita WHERE status = "published"';
    const params = [];

    if (kategori) {
      query += ' AND kategori = ?';
      countQuery += ' AND kategori = ?';
      params.push(kategori);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;

    const [rows] = await db.query(query, [...params, limit, offset]);
    const [countResult] = await db.query(countQuery, params);

    return {
      data: rows,
      pagination: { page, limit, total: countResult[0].total, totalPages: Math.ceil(countResult[0].total / limit) },
    };
  },
};

module.exports = Berita;
