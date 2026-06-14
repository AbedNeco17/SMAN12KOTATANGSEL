const AdminUser = require('../../models/AdminUser');
const db = require('../../config/database');

// Mock database module
jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));

describe('AdminUser Model Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    it('should return user details when username exists', async () => {
      const mockUser = { id: 1, username: 'admin', password: 'hashedpassword' };
      db.query.mockResolvedValueOnce([[mockUser]]);

      const result = await AdminUser.findByUsername('admin');

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM admin_users WHERE username = ?',
        ['admin']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when username does not exist', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const result = await AdminUser.findByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user profile details by ID', async () => {
      const mockUserProfile = { id: 1, username: 'admin', email: 'admin@sman12.sch.id', nama_lengkap: 'Administrator', role: 'superadmin' };
      db.query.mockResolvedValueOnce([[mockUserProfile]]);

      const result = await AdminUser.findById(1);

      expect(db.query).toHaveBeenCalledWith(
        'SELECT id, username, email, nama_lengkap, role, created_at FROM admin_users WHERE id = ?',
        [1]
      );
      expect(result).toEqual(mockUserProfile);
    });

    it('should return null when user ID does not exist', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const result = await AdminUser.findById(99);

      expect(result).toBeNull();
    });
  });

  describe('updatePassword', () => {
    it('should update password and return true on success', async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await AdminUser.updatePassword(1, 'newhashedpassword');

      expect(db.query).toHaveBeenCalledWith(
        'UPDATE admin_users SET password = ? WHERE id = ?',
        ['newhashedpassword', 1]
      );
      expect(result).toBe(true);
    });

    it('should return false if password update fails', async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const result = await AdminUser.updatePassword(99, 'newhashedpassword');

      expect(result).toBe(false);
    });
  });
});
