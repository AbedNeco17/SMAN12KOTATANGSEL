const Galeri = require('../../models/Galeri');
const db = require('../../config/database');

// Mock database module
jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));

describe('Galeri Model Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert new gallery item and return details with insertId', async () => {
      const inputData = {
        judul: 'Pesta Olahraga Porseni 2026',
        deskripsi: 'Kegiatan porseni tahunan sekolah',
        gambar: 'porseni2026.jpg',
        kategori: 'kegiatan',
        author_id: 1,
      };

      db.query.mockResolvedValueOnce([{ insertId: 5 }]);

      const result = await Galeri.create(inputData);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO galeri'),
        [
          inputData.judul,
          inputData.deskripsi,
          inputData.gambar,
          inputData.kategori,
          inputData.author_id,
        ]
      );
      expect(result).toEqual({ id: 5, ...inputData });
    });
  });

  describe('update', () => {
    it('should update gallery item and return true on success', async () => {
      const updateData = {
        judul: 'Porseni SMAN 12 Terupdate',
        kategori: 'kegiatan',
      };

      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await Galeri.update(5, updateData);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE galeri SET'),
        [updateData.judul, updateData.kategori, 5]
      );
      expect(result).toBe(true);
    });

    it('should return false if no fields are updated', async () => {
      const result = await Galeri.update(5, {});
      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete gallery item and return true on success', async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await Galeri.delete(5);

      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM galeri WHERE id = ?',
        [5]
      );
      expect(result).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return gallery item when found', async () => {
      const mockItem = {
        id: 5,
        judul: 'Porseni',
        deskripsi: 'Deskripsi...',
        gambar: 'porseni.jpg',
        kategori: 'kegiatan',
        author_name: 'Administrator',
      };

      db.query.mockResolvedValueOnce([[mockItem]]);

      const result = await Galeri.findById(5);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT g.*, a.nama_lengkap AS author_name FROM galeri g'),
        [5]
      );
      expect(result).toEqual(mockItem);
    });

    it('should return null when gallery item is not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const result = await Galeri.findById(99);

      expect(result).toBeNull();
    });
  });
});
