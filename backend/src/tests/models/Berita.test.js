const Berita = require('../../models/Berita');
const db = require('../../config/database');

// Mock database module
jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));

describe('Berita Model Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert new news article and return details with insertId', async () => {
      const inputData = {
        judul: 'Penerimaan Siswa Baru SMAN 12',
        slug: 'penerimaan-siswa-baru-sman-12',
        konten: 'Pendaftaran PPDB online telah dibuka...',
        thumbnail: 'ppdb.jpg',
        kategori: 'berita',
        status: 'published',
        author_id: 1,
      };

      db.query.mockResolvedValueOnce([{ insertId: 10 }]);

      const result = await Berita.create(inputData);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO berita'),
        [
          inputData.judul,
          inputData.slug,
          inputData.konten,
          inputData.thumbnail,
          inputData.kategori,
          inputData.status,
          inputData.author_id,
        ]
      );
      expect(result).toEqual({ id: 10, ...inputData });
    });
  });

  describe('update', () => {
    it('should update news data and return true on success', async () => {
      const updateData = {
        judul: 'Penerimaan PPDB SMAN 12 Diperpanjang',
        status: 'published',
      };

      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await Berita.update(10, updateData);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE berita SET'),
        [updateData.judul, updateData.status, 10]
      );
      expect(result).toBe(true);
    });

    it('should return false if no fields are updated', async () => {
      const result = await Berita.update(10, {});
      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete news article and return true on success', async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await Berita.delete(10);

      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM berita WHERE id = ?',
        [10]
      );
      expect(result).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return news article when found', async () => {
      const mockNews = {
        id: 10,
        judul: 'PPDB SMAN 12',
        slug: 'ppdb-sman-12',
        konten: 'Isi...',
        author_name: 'Administrator',
      };

      db.query.mockResolvedValueOnce([[mockNews]]);

      const result = await Berita.findById(10);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT b.*, a.nama_lengkap AS author_name FROM berita b'),
        [10]
      );
      expect(result).toEqual(mockNews);
    });

    it('should return null when news article is not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const result = await Berita.findById(99);

      expect(result).toBeNull();
    });
  });
});
