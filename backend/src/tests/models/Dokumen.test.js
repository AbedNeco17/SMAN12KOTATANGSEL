const Dokumen = require('../../models/Dokumen');
const db = require('../../config/database');

// Mock database module
jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));

describe('Dokumen Model Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert new document record and return details with insertId', async () => {
      const inputData = {
        judul: 'Tata Tertib Sekolah 2026',
        deskripsi: 'Panduan tata tertib siswa SMAN 12',
        file_path: 'uploads/tatatertib.pdf',
        tipe: 'kurikulum',
        ukuran_file: 2048576, // 2MB
        author_id: 1,
      };

      db.query.mockResolvedValueOnce([{ insertId: 7 }]);

      const result = await Dokumen.create(inputData);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO dokumen'),
        [
          inputData.judul,
          inputData.deskripsi,
          inputData.file_path,
          inputData.tipe,
          inputData.ukuran_file,
          inputData.author_id,
        ]
      );
      expect(result).toEqual({ id: 7, ...inputData });
    });
  });

  describe('update', () => {
    it('should update document record and return true on success', async () => {
      const updateData = {
        judul: 'Tata Tertib Sekolah 2026 Edisi Revisi',
        tipe: 'kurikulum',
      };

      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await Dokumen.update(7, updateData);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE dokumen SET'),
        [updateData.judul, updateData.tipe, 7]
      );
      expect(result).toBe(true);
    });

    it('should return false if no fields are updated', async () => {
      const result = await Dokumen.update(7, {});
      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete document record and return true on success', async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await Dokumen.delete(7);

      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM dokumen WHERE id = ?',
        [7]
      );
      expect(result).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return document record when found', async () => {
      const mockDoc = {
        id: 7,
        judul: 'Tata Tertib',
        deskripsi: 'Deskripsi...',
        file_path: 'tatatertib.pdf',
        tipe: 'kurikulum',
        ukuran_file: 1000,
        author_name: 'Administrator',
      };

      db.query.mockResolvedValueOnce([[mockDoc]]);

      const result = await Dokumen.findById(7);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT d.*, a.nama_lengkap AS author_name FROM dokumen d'),
        [7]
      );
      expect(result).toEqual(mockDoc);
    });

    it('should return null when document is not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const result = await Dokumen.findById(99);

      expect(result).toBeNull();
    });
  });
});
