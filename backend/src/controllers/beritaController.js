const Berita = require('../models/Berita');
const { slugify, sendSuccess, sendError, deleteFile } = require('../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, kategori, status, search } = req.query;
    const result = await Berita.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      kategori,
      status,
      search,
    });
    sendSuccess(res, result);
  } catch (error) {
    console.error('Get berita error:', error.message);
    sendError(res, 'Gagal memuat data berita');
  }
};

exports.getPublished = async (req, res) => {
  try {
    const { page = 1, limit = 6, kategori } = req.query;
    const result = await Berita.findPublished({
      page: parseInt(page),
      limit: parseInt(limit),
      kategori,
    });
    sendSuccess(res, result);
  } catch (error) {
    console.error('Get public berita error:', error.message);
    sendError(res, 'Gagal memuat data berita');
  }
};

exports.getById = async (req, res) => {
  try {
    const berita = await Berita.findById(req.params.id);
    if (!berita) {
      return sendError(res, 'Berita tidak ditemukan', 404);
    }
    sendSuccess(res, { data: berita });
  } catch (error) {
    console.error('Get berita by id error:', error.message);
    sendError(res, 'Gagal memuat berita');
  }
};

exports.create = async (req, res) => {
  try {
    const { judul, konten, kategori, status } = req.body;

    if (!judul || !konten) {
      return sendError(res, 'Judul dan konten wajib diisi', 400);
    }

    const slug = slugify(judul) + '-' + Date.now();
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

    const berita = await Berita.create({
      judul,
      slug,
      konten,
      thumbnail,
      kategori: kategori || 'berita',
      status: status || 'draft',
      author_id: req.user?.id || null,
    });

    sendSuccess(res, { data: berita }, 'Berita berhasil dibuat', 201);
  } catch (error) {
    console.error('Create berita error:', error.message);
    sendError(res, 'Gagal membuat berita');
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Berita.findById(id);
    if (!existing) {
      return sendError(res, 'Berita tidak ditemukan', 404);
    }

    const updateData = { ...req.body };

    if (updateData.judul && updateData.judul !== existing.judul) {
      updateData.slug = slugify(updateData.judul) + '-' + Date.now();
    }

    if (req.file) {
      updateData.thumbnail = `/uploads/${req.file.filename}`;
      deleteFile(existing.thumbnail);
    }

    const updated = await Berita.update(id, updateData);
    if (!updated) {
      return sendError(res, 'Tidak ada data yang diubah', 400);
    }

    const berita = await Berita.findById(id);
    sendSuccess(res, { data: berita }, 'Berita berhasil diperbarui');
  } catch (error) {
    console.error('Update berita error:', error.message);
    sendError(res, 'Gagal memperbarui berita');
  }
};

exports.delete = async (req, res) => {
  try {
    const existing = await Berita.findById(req.params.id);
    if (!existing) {
      return sendError(res, 'Berita tidak ditemukan', 404);
    }

    deleteFile(existing.thumbnail);

    await Berita.delete(req.params.id);
    sendSuccess(res, {}, 'Berita berhasil dihapus');
  } catch (error) {
    console.error('Delete berita error:', error.message);
    sendError(res, 'Gagal menghapus berita');
  }
};
