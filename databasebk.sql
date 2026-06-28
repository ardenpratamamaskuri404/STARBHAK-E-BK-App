CREATE DATABASE IF NOT EXISTS db_projectbk;
USE db_projectbk;

CREATE TABLE IF NOT EXISTS kelas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    wali_kelas_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    role ENUM('admin', 'guru', 'siswa') NOT NULL,
    name VARCHAR(255) NOT NULL,
    nis VARCHAR(50) NULL,
    kelas VARCHAR(50) NULL,
    phone VARCHAR(50) NULL,
    avatar_url VARCHAR(512) NULL,
    is_active TINYINT(1) NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS siswa_profile (
    user_id BIGINT UNSIGNED NOT NULL,
    nis VARCHAR(50) NOT NULL,
    tanggal_lahir DATE NULL,
    alamat TEXT NULL,
    kelas_id INT UNSIGNED NULL,
    emergency_contact VARCHAR(255) NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS guru_profile (
    user_id BIGINT UNSIGNED NOT NULL,
    nip VARCHAR(50) NULL,
    mata_pelajaran VARCHAR(255) NULL,
    jabatan VARCHAR(100) NULL,
    bio TEXT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS borrows (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NULL,
    admin_id BIGINT UNSIGNED NULL,
    type ENUM('konseling', 'pinjam', 'lainnya') NULL DEFAULT 'konseling',
    title VARCHAR(255) NULL,
    description TEXT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') NULL DEFAULT 'pending',
    requested_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    scheduled_at DATETIME NULL,
    approved_at TIMESTAMP NULL,
    rejected_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    return_deadline DATETIME NULL,
    metadata JSON NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS borrowings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    guru_id BIGINT UNSIGNED NOT NULL,
    tanggal DATE NOT NULL,
    jam TIME NOT NULL,
    alasan TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (siswa_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (guru_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS jadwal_konseling (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    scheduled_datetime DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    lokasi VARCHAR(100),
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS laporan_konseling (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    jadwal_id BIGINT UNSIGNED NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    summary TEXT NULL,
    detail TEXT NULL,
    follow_up TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (jadwal_id) REFERENCES jadwal_konseling(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS catatan_siswa (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    judul VARCHAR(255) NOT NULL,
    isi TEXT NOT NULL,
    kategori VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pengajuan_jadwal (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    proposed_datetime DATETIME NOT NULL,
    reason TEXT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NULL,
    record_id BIGINT UNSIGNED NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notif_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nis ON users(nis);
CREATE INDEX idx_borrows_student ON borrows(student_id);
CREATE INDEX idx_borrows_teacher ON borrows(teacher_id);
CREATE INDEX idx_borrows_status ON borrows(status);
CREATE INDEX idx_borrowings_siswa ON borrowings(siswa_id);
CREATE INDEX idx_borrowings_guru ON borrowings(guru_id);
CREATE INDEX idx_borrowings_status ON borrowings(status);
CREATE INDEX idx_jadwal_student ON jadwal_konseling(student_id);
CREATE INDEX idx_jadwal_teacher ON jadwal_konseling(teacher_id);
CREATE INDEX idx_catatan_student ON catatan_siswa(student_id);
CREATE INDEX idx_catatan_teacher ON catatan_siswa(teacher_id);

INSERT INTO kelas (nama) VALUES 
('X RPL 1'),
('X RPL 2'),
('XI RPL 1'),
('XI RPL 2'),
('XII RPL 1'),
('XII RPL 2');

-- ========================================
-- ALTER TABLE untuk update database yang sudah ada
-- Jalankan ini jika database sudah ada dan perlu ditambah kolom/tabel baru
-- ========================================

-- Tambah tabel borrowings jika belum ada
CREATE TABLE IF NOT EXISTS borrowings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    guru_id BIGINT UNSIGNED NOT NULL,
    tanggal DATE NOT NULL,
    jam TIME NOT NULL,
    alasan TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (siswa_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (guru_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tambah tabel pengajuan_jadwal jika belum ada
CREATE TABLE IF NOT EXISTS pengajuan_jadwal (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    proposed_datetime DATETIME NOT NULL,
    reason TEXT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tambah tabel audit_log jika belum ada
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NULL,
    record_id BIGINT UNSIGNED NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tambah tabel notif_log jika belum ada
CREATE TABLE IF NOT EXISTS notif_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tambah kolom yang mungkin belum ada di tabel users
-- Note: Jika muncul error "Duplicate column name", abaikan saja (kolom sudah ada)
ALTER TABLE users ADD COLUMN nis VARCHAR(50) NULL AFTER name;
ALTER TABLE users ADD COLUMN kelas VARCHAR(50) NULL AFTER nis;
ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL AFTER kelas;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(512) NULL AFTER phone;
ALTER TABLE users ADD COLUMN is_active TINYINT(1) NULL DEFAULT 1 AFTER avatar_url;
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Tambah kolom scheduled_at di borrows jika belum ada
ALTER TABLE borrows ADD COLUMN scheduled_at DATETIME NULL AFTER requested_at;
ALTER TABLE borrows ADD COLUMN approved_at TIMESTAMP NULL AFTER scheduled_at;
ALTER TABLE borrows ADD COLUMN rejected_at TIMESTAMP NULL AFTER approved_at;
ALTER TABLE borrows ADD COLUMN completed_at TIMESTAMP NULL AFTER rejected_at;
ALTER TABLE borrows ADD COLUMN return_deadline DATETIME NULL AFTER completed_at;
ALTER TABLE borrows ADD COLUMN metadata JSON NULL AFTER return_deadline;
ALTER TABLE borrows ADD COLUMN admin_id BIGINT UNSIGNED NULL AFTER teacher_id;
ALTER TABLE borrows ADD COLUMN type ENUM('konseling', 'pinjam', 'lainnya') NULL DEFAULT 'konseling' AFTER admin_id;
ALTER TABLE borrows ADD COLUMN title VARCHAR(255) NULL AFTER type;
ALTER TABLE borrows ADD COLUMN description TEXT NULL AFTER title;

-- Tambah indexes jika belum ada
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_nis ON users(nis);
CREATE INDEX IF NOT EXISTS idx_borrows_student ON borrows(student_id);
CREATE INDEX IF NOT EXISTS idx_borrows_teacher ON borrows(teacher_id);
CREATE INDEX IF NOT EXISTS idx_borrows_status ON borrows(status);
CREATE INDEX IF NOT EXISTS idx_borrowings_siswa ON borrowings(siswa_id);
CREATE INDEX IF NOT EXISTS idx_borrowings_guru ON borrowings(guru_id);
CREATE INDEX IF NOT EXISTS idx_borrowings_status ON borrowings(status);
CREATE INDEX IF NOT EXISTS idx_jadwal_student ON jadwal_konseling(student_id);
CREATE INDEX IF NOT EXISTS idx_jadwal_teacher ON jadwal_konseling(teacher_id);
CREATE INDEX IF NOT EXISTS idx_catatan_student ON catatan_siswa(student_id);
CREATE INDEX IF NOT EXISTS idx_catatan_teacher ON catatan_siswa(teacher_id);