import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import { readFileSync } from "fs";

// Read .env file manually
const envContent = readFileSync(".env", "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join("=").trim();
  }
});

async function seed() {
  const pool = mysql.createPool({
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    database: envVars.DB_NAME,
  });

  try {
    console.log("🌱 Starting database seed...\n");

    // Hash passwords
    const adminPass = await bcrypt.hash("admin123", 10);
    const guruPass = await bcrypt.hash("guru123", 10);
    const siswaPass = await bcrypt.hash("siswa123", 10);

    // Insert Admin
    const [adminResult] = await pool.query(
      `INSERT INTO users (name, username, email, password, role, role_id, is_active) 
       VALUES (?, ?, ?, ?, 'admin', 1, 1)`,
      ["Administrator", "admin", "admin@school.com", adminPass]
    );
    console.log("✅ Admin created:", { id: adminResult.insertId, email: "admin@school.com", password: "admin123" });

    // Insert Guru BK
    const [guruResult] = await pool.query(
      `INSERT INTO users (name, username, email, password, role, role_id, phone, is_active) 
       VALUES (?, ?, ?, ?, 'guru', 2, '081234567890', 1)`,
      ["Guru BK 1", "guru1", "guru1@school.com", guruPass]
    );
    console.log("✅ Guru created:", { id: guruResult.insertId, email: "guru1@school.com", password: "guru123" });

    // Insert Guru Profile
    await pool.query(
      `INSERT INTO guru_profile (user_id, nip, mata_pelajaran, jabatan, bio) 
       VALUES (?, ?, ?, ?, ?)`,
      [guruResult.insertId, "198501012010011001", "Bimbingan Konseling", "Guru BK", "Guru BK berpengalaman 10 tahun"]
    );

    // Insert Siswa 1
    const [siswa1Result] = await pool.query(
      `INSERT INTO users (name, username, email, password, role, role_id, phone, is_active) 
       VALUES (?, ?, ?, ?, 'siswa', 3, '081234567891', 1)`,
      ["Siswa 1", "siswa1", "siswa1@student.com", siswaPass]
    );
    console.log("✅ Siswa 1 created:", { id: siswa1Result.insertId, email: "siswa1@student.com", password: "siswa123" });

    await pool.query(
      `INSERT INTO siswa_profile (user_id, nis, tanggal_lahir, alamat, kelas_id, emergency_contact) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [siswa1Result.insertId, "2024001", "2008-05-15", "Jl. Merdeka No. 1", 1, "081234567800"]
    );

    // Insert Siswa 2
    const [siswa2Result] = await pool.query(
      `INSERT INTO users (name, username, email, password, role, role_id, phone, is_active) 
       VALUES (?, ?, ?, ?, 'siswa', 3, '081234567892', 1)`,
      ["Siswa 2", "siswa2", "siswa2@student.com", siswaPass]
    );
    console.log("✅ Siswa 2 created:", { id: siswa2Result.insertId, email: "siswa2@student.com", password: "siswa123" });

    await pool.query(
      `INSERT INTO siswa_profile (user_id, nis, tanggal_lahir, alamat, kelas_id, emergency_contact) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [siswa2Result.insertId, "2024002", "2008-06-20", "Jl. Kebangsaan No. 2", 2, "081234567801"]
    );

    console.log("\n✅ Seed completed successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("   Admin: admin@school.com / admin123");
    console.log("   Guru:  guru1@school.com / guru123");
    console.log("   Siswa: siswa1@student.com / siswa123");
    console.log("          siswa2@student.com / siswa123\n");

  } catch (error) {
    console.error("❌ Seed error:", error.message);
  } finally {
    await pool.end();
  }
}

seed();
