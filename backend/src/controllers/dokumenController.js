const Dokumen = require('../models/Dokumen');
const { sendSuccess, sendError, deleteFile } = require('../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, tipe } = req.query;
    const result = await Dokumen.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      tipe,
    });
    sendSuccess(res, result);
  } catch (error) {
    console.error('Get dokumen error:', error.message);
    sendError(res, 'Gagal memuat data dokumen');
  }
};

exports.getById = async (req, res) => {
  try {
    const dokumen = await Dokumen.findById(req.params.id);
    if (!dokumen) {
      return sendError(res, 'Dokumen tidak ditemukan', 404);
    }
    sendSuccess(res, { data: dokumen });
  } catch (error) {
    console.error('Get dokumen by id error:', error.message);
    sendError(res, 'Gagal memuat dokumen');
  }
};

exports.create = async (req, res) => {
  try {
    const { judul, deskripsi, tipe } = req.body;

    if (!judul) {
      return sendError(res, 'Judul wajib diisi', 400);
    }
    if (!req.file) {
      return sendError(res, 'File wajib diupload', 400);
    }

    const file_path = `/uploads/${req.file.filename}`;
    const ukuran_file = req.file.size;

    const dokumen = await Dokumen.create({
      judul,
      deskripsi,
      file_path,
      tipe: tipe || 'lainnya',
      ukuran_file,
      author_id: req.user?.id || null,
    });

    sendSuccess(res, { data: dokumen }, 'Dokumen berhasil diupload', 201);
  } catch (error) {
    console.error('Create dokumen error:', error.message);
    sendError(res, 'Gagal mengupload dokumen');
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await Dokumen.findById(req.params.id);
    if (!existing) {
      return sendError(res, 'Dokumen tidak ditemukan', 404);
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.file_path = `/uploads/${req.file.filename}`;
      updateData.ukuran_file = req.file.size;
      deleteFile(existing.file_path);
    }

    const updated = await Dokumen.update(req.params.id, updateData);
    if (!updated) {
      return sendError(res, 'Tidak ada data yang diubah', 400);
    }

    const dokumen = await Dokumen.findById(req.params.id);
    sendSuccess(res, { data: dokumen }, 'Dokumen berhasil diperbarui');
  } catch (error) {
    console.error('Update dokumen error:', error.message);
    sendError(res, 'Gagal memperbarui dokumen');
  }
};

exports.delete = async (req, res) => {
  try {
    const existing = await Dokumen.findById(req.params.id);
    if (!existing) {
      return sendError(res, 'Dokumen tidak ditemukan', 404);
    }

    deleteFile(existing.file_path);
    await Dokumen.delete(req.params.id);
    sendSuccess(res, {}, 'Dokumen berhasil dihapus');
  } catch (error) {
    console.error('Delete dokumen error:', error.message);
    sendError(res, 'Gagal menghapus dokumen');
  }
};
