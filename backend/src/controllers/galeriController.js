const Galeri = require('../models/Galeri');
const { sendSuccess, sendError, deleteFile } = require('../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12, kategori } = req.query;
    const result = await Galeri.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      kategori,
    });
    sendSuccess(res, result);
  } catch (error) {
    console.error('Get galeri error:', error.message);
    sendError(res, 'Gagal memuat data galeri');
  }
};

exports.getById = async (req, res) => {
  try {
    const galeri = await Galeri.findById(req.params.id);
    if (!galeri) {
      return sendError(res, 'Galeri tidak ditemukan', 404);
    }
    sendSuccess(res, { data: galeri });
  } catch (error) {
    console.error('Get galeri by id error:', error.message);
    sendError(res, 'Gagal memuat galeri');
  }
};

exports.create = async (req, res) => {
  try {
    const { judul, deskripsi, kategori } = req.body;

    if (!judul) {
      return sendError(res, 'Judul wajib diisi', 400);
    }
    if (!req.file) {
      return sendError(res, 'Gambar wajib diupload', 400);
    }

    const gambar = `/uploads/${req.file.filename}`;

    const galeri = await Galeri.create({
      judul,
      deskripsi,
      gambar,
      kategori: kategori || 'kegiatan',
      author_id: req.user?.id || null,
    });

    sendSuccess(res, { data: galeri }, 'Galeri berhasil ditambahkan', 201);
  } catch (error) {
    console.error('Create galeri error:', error.message);
    sendError(res, 'Gagal menambah galeri');
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await Galeri.findById(req.params.id);
    if (!existing) {
      return sendError(res, 'Galeri tidak ditemukan', 404);
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.gambar = `/uploads/${req.file.filename}`;
      deleteFile(existing.gambar);
    }

    const updated = await Galeri.update(req.params.id, updateData);
    if (!updated) {
      return sendError(res, 'Tidak ada data yang diubah', 400);
    }

    const galeri = await Galeri.findById(req.params.id);
    sendSuccess(res, { data: galeri }, 'Galeri berhasil diperbarui');
  } catch (error) {
    console.error('Update galeri error:', error.message);
    sendError(res, 'Gagal memperbarui galeri');
  }
};

exports.delete = async (req, res) => {
  try {
    const existing = await Galeri.findById(req.params.id);
    if (!existing) {
      return sendError(res, 'Galeri tidak ditemukan', 404);
    }

    deleteFile(existing.gambar);
    await Galeri.delete(req.params.id);
    sendSuccess(res, {}, 'Galeri berhasil dihapus');
  } catch (error) {
    console.error('Delete galeri error:', error.message);
    sendError(res, 'Gagal menghapus galeri');
  }
};
