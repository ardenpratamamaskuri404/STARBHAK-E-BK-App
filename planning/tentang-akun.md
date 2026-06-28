# Informasi Akun - Aplikasi EBK (E-Bimbingan Konseling)

## SMK TARUNA BHAKTI

---

## Cara Login

Aplikasi ini mendukung **3 metode login**:
1. **Email** - Alamat email yang terdaftar
2. **NIS** - Nomor Induk Siswa (untuk siswa)
3. **NIP** - Nomor Induk Pegawai (untuk guru)

---

## Akun yang Terdaftar di Database

### Admin
| Name | Email | Password |
|------|-------|----------|
| Admin BK | admin@tb.sch.id | admin123 |

### Guru BK
| Name | Email | NIP | Password |
|------|-------|-----|----------|
| Ricky Sudrajat | rickysudrajat@tb.sch.id | GR2026001 | guru123 |
| Heni Siswati, S.Psi | henisiswati@tb.sch.id | GR2026002 | guru123 |
| Kasandra Fitriani. N, S.Pd | kasandra@tb.sch.id | GR2026003 | guru123 |
| Nadya Afriliani Ariesta, S.Pd | nadyaafriliani@tb.sch.id | GR2026004 | guru123 |
| Ika Rafika, S.Pd | ikarafika@tb.sch.id | GR2026005 | guru123 |

### Siswa
| Name | Email | NIS | Kelas | Password |
|------|-------|-----|-------|----------|
| Arden Pratama Maskuri | ardenaja99@gmail.com | - | - | siswa123 |
| Miko Andrianto | miko@gmail.com | - | - | siswa123 |
| muhammad arkan afif | arkanafif@gmail.com | - | - | siswa123 |

---

## Lupa Password?

Jika Anda lupa password, jalankan script berikut untuk reset semua password:

```bash
node reset-passwords.js
```

Script ini akan:
1. Reset password semua akun (Admin, Guru, Siswa)
2. Menampilkan daftar akun dengan credentials baru
3. Tidak menghapus data lainnya

### Default Password Setelah Reset:
- **Admin**: `admin123`
- **Guru**: `guru123`
- **Siswa**: `siswa123`

---

## Tips Login

### Untuk Siswa:
- Bisa login menggunakan **NIS** atau **Email**
- Contoh: `2024001` atau `ardenaja99@gmail.com`

### Untuk Guru:
- Bisa login menggunakan **NIP** atau **Email**
- Contoh: `GR2026001` atau `rickysudrajat@tb.sch.id`

### Untuk Admin:
- Bisa login menggunakan **Email**
- Contoh: `admin@tb.sch.id`

---

## Struktur Database

### Tabel Utama
- **users** - Data semua pengguna (admin, guru, siswa)
  - Kolom: id, email, password, role, name, nis, kelas, phone, avatar_url, is_active
- **kelas** - Data kelas/rombel
  - Kolom: id, nama, wali_kelas_id
- **siswa_profile** - Profil detail siswa
  - Kolom: user_id, nis, tanggal_lahir, alamat, kelas_id, emergency_contact
- **guru_profile** - Profil detail guru
  - Kolom: user_id, nip, mata_pelajaran, jabatan, bio

### Tabel Transaksi
- **borrows** - Pengajuan konseling/peminjaman
  - Kolom: id, student_id, teacher_id, admin_id, type, title, description, status, requested_at, scheduled_at, approved_at, rejected_at, completed_at, return_deadline, metadata
- **jadwal_konseling** - Jadwal sesi konseling
- **laporan_konseling** - Laporan hasil konseling
- **catatan_siswa** - Catatan guru untuk siswa
- **notifications** - Notifikasi sistem
- **pengajuan_jadwal** - Pengajuan jadwal
- **audit_log** - Log audit
- **notif_log** - Log notifikasi

---

## Troubleshooting

### Error 401 saat Login?
1. Pastikan password sudah di-reset: `node reset-passwords.js`
2. Gunakan email/NIS/NIP yang terdaftar (lihat tabel di atas)
3. Pastikan MySQL sedang berjalan (Laragon)

### Error "User not found"?
- Pastikan menggunakan credentials yang benar dari tabel di atas
- Untuk siswa tanpa NIS, gunakan email untuk login

### Error Database?
1. Cek koneksi di file `.env`
2. Pastikan database `db_projectbk` exists
3. Jalankan `node check-schema.js` untuk melihat struktur database

---

## Utility Scripts

| Script | Fungsi |
|--------|--------|
| `check-db.js` | Cek status database dan daftar user |
| `check-schema.js` | Lihat struktur tabel database |
| `reset-passwords.js` | Reset password semua akun |
| `recovery.js` | Recovery & reset password interaktif |
| `seed.js` | Buat akun sample baru |

---

**Terakhir diupdate:** 2026-06-27
