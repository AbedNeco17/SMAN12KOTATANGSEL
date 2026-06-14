import { describe, it, expect, beforeEach, vi } from 'vitest';

// Polyfill and Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

// Import localStore after stubbing localStorage
const { localStore } = await import('./localStore');

describe('localStore Unit Tests (Siswa, Orang Tua, & Guru/BK)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    
    // Seed initial store data
    // localStore.js automatically runs initStore() upon import,
    // but since we cleared localStorage, we can trigger initStore mock by calling localStore methods
  });

  describe('Siswa Section (Poin & Riwayat)', () => {
    it('should retrieve student details by NISN', () => {
      // Set test student data
      const mockSiswa = [
        { nisn: '0012345678', name: 'Lucas Adiputra', poin_pelanggaran: 5, poin_penghargaan: 45, status: 'Panggilan I' }
      ];
      localStorage.setItem('sman12_siswa_poin', JSON.stringify(mockSiswa));

      const student = localStore.getSiswaByNisn('0012345678');
      expect(student).toBeDefined();
      expect(student.name).toBe('Lucas Adiputra');
      expect(student.poin_pelanggaran).toBe(5);
      expect(student.poin_penghargaan).toBe(45);
      expect(student.status).toBe('Panggilan I');
    });

    it('should add positive points and create notification & history record', () => {
      const mockSiswa = [
        { nisn: '0012345678', name: 'Lucas Adiputra', poin_pelanggaran: 0, poin_penghargaan: 20, status: 'Bebas Pelanggaran' }
      ];
      localStorage.setItem('sman12_siswa_poin', JSON.stringify(mockSiswa));
      localStorage.setItem('sman12_riwayat_poin', JSON.stringify([]));
      localStorage.setItem('sman12_siswa_notifikasi', JSON.stringify([]));

      // Add +10 points to Kategori 'Penghargaan'
      localStore.updateSiswaPoin('0012345678', 'Penghargaan', 10, 'positive', 'Merapikan perpustakaan');

      // Verify points increased
      const student = localStore.getSiswaByNisn('0012345678');
      expect(student.poin_penghargaan).toBe(30);
      expect(student.poin_pelanggaran).toBe(0);
      expect(student.status).toBe('Bebas Pelanggaran');

      // Verify history created
      const history = localStore.getRiwayatPoin('0012345678');
      expect(history.length).toBe(1);
      expect(history[0].poin).toBe('+10 Poin');
      expect(history[0].keterangan).toBe('Merapikan perpustakaan');

      // Verify notification created
      const notifications = localStore.getSiswaNotifikasi('0012345678');
      expect(notifications.length).toBe(1);
      expect(notifications[0].tipe).toBe('success');
      expect(notifications[0].pesan).toContain('Lucas Adiputra mendapatkan tambahan 10 poin');
    });

    it('should accumulate violation points and update status accordingly', () => {
      const mockSiswa = [
        { nisn: '0012345678', name: 'Lucas Adiputra', poin_pelanggaran: 15, poin_penghargaan: 20, status: 'Panggilan I' }
      ];
      localStorage.setItem('sman12_siswa_poin', JSON.stringify(mockSiswa));
      localStorage.setItem('sman12_riwayat_poin', JSON.stringify([]));
      localStorage.setItem('sman12_siswa_notifikasi', JSON.stringify([]));

      // Add 15 violation points for 'Pelanggaran Sedang'
      localStore.updateSiswaPoin('0012345678', 'Pelanggaran Sedang', 15, 'negative', 'Melanggar ketertiban kelas');

      const student = localStore.getSiswaByNisn('0012345678');
      expect(student.poin_pelanggaran).toBe(30); // 15 + 15 = 30
      expect(student.status).toBe('Panggilan II'); // 21 - 40 is Panggilan II

      const notifications = localStore.getSiswaNotifikasi('0012345678');
      expect(notifications[0].tipe).toBe('warning');
      expect(notifications[0].pesan).toContain('Lucas Adiputra menerima penambahan 15 poin pelanggaran');
    });
  });

  describe('Orang Tua Section (Notifikasi & Konsultasi)', () => {
    it('should allow parent to send consultation message to BK', () => {
      localStorage.setItem('sman12_pesan_bk', JSON.stringify([]));

      // Parent sends a message
      localStore.addPesanBk(
        '0012345678',
        'Bapak Hermawan',
        'Lucas Adiputra',
        'XII MIPA 2',
        'Apakah nilai kedisiplinan anak saya bisa ditingkatkan kembali?'
      );

      const messages = localStore.getPesanBk();
      expect(messages.length).toBe(1);
      expect(messages[0].namaOrangTua).toBe('Bapak Hermawan');
      expect(messages[0].pesan).toBe('Apakah nilai kedisiplinan anak saya bisa ditingkatkan kembali?');
      expect(messages[0].dibalas).toBe(false);
    });

    it('should fetch notifications for parents to monitor student points', () => {
      const mockNotif = [
        { id: 1, nisn: '0012345678', tipe: 'warning', pesan: 'Poin berkurang', dibaca: false }
      ];
      localStorage.setItem('sman12_siswa_notifikasi', JSON.stringify(mockNotif));

      const notifications = localStore.getSiswaNotifikasi('0012345678');
      expect(notifications.length).toBe(1);
      expect(notifications[0].pesan).toBe('Poin berkurang');
    });
  });

  describe('Guru/BK Section (Manajemen Pesan)', () => {
    it('should allow BK Teacher to reply to parent message', () => {
      const mockPesan = [
        {
          id: 5,
          nisn: '0012345678',
          namaOrangTua: 'Bapak Hermawan',
          namaSiswa: 'Lucas Adiputra',
          pesan: 'Tanya kedisiplinan',
          dibalas: false,
          balasan: ''
        }
      ];
      localStorage.setItem('sman12_pesan_bk', JSON.stringify(mockPesan));

      // BK teacher replies
      localStore.balasPesanBk(5, 'Tentu, silakan membimbing anak di rumah agar datang tepat waktu.');

      const messages = localStore.getPesanBk();
      expect(messages[0].dibalas).toBe(true);
      expect(messages[0].balasan).toBe('Tentu, silakan membimbing anak di rumah agar datang tepat waktu.');
    });
  });
});
