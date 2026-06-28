import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";

const envContent = readFileSync(".env", "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join("=").trim();
  }
});

async function resetPasswords() {
  const pool = mysql.createPool({
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    database: envVars.DB_NAME,
  });

  try {
    console.log("\n========================================");
    console.log("  RESET PASSWORD SEMUA AKUN");
    console.log("========================================\n");

    // Default passwords
    const passwords = {
      admin: "admin123",
      guru: "guru123",
      siswa: "siswa123",
    };

    const hashedAdmin = await bcrypt.hash(passwords.admin, 10);
    const hashedGuru = await bcrypt.hash(passwords.guru, 10);
    const hashedSiswa = await bcrypt.hash(passwords.siswa, 10);

    // Reset admin passwords
    const [adminResult] = await pool.query(
      "UPDATE users SET password = ? WHERE role = 'admin'",
      [hashedAdmin]
    );
    console.log(`✅ Admin passwords reset: ${adminResult.affectedRows} users`);

    // Reset guru passwords
    const [guruResult] = await pool.query(
      "UPDATE users SET password = ? WHERE role = 'guru'",
      [hashedGuru]
    );
    console.log(`✅ Guru passwords reset: ${guruResult.affectedRows} users`);

    // Reset siswa passwords
    const [siswaResult] = await pool.query(
      "UPDATE users SET password = ? WHERE role = 'siswa'",
      [hashedSiswa]
    );
    console.log(`✅ Siswa passwords reset: ${siswaResult.affectedRows} users`);

    console.log("\n========================================");
    console.log("  PASSWORD BERHASIL DI-RESET!");
    console.log("========================================\n");

    console.log("📝 Login Credentials:\n");

    // Show admin accounts
    const [admins] = await pool.query("SELECT name, email FROM users WHERE role = 'admin'");
    console.log("🔑 ADMIN:");
    admins.forEach((a) => {
      console.log(`   Email: ${a.email}`);
      console.log(`   Password: ${passwords.admin}\n`);
    });

    // Show guru accounts
    const [gurus] = await pool.query(
      `SELECT u.name, u.email, gp.nip 
       FROM users u 
       LEFT JOIN guru_profile gp ON gp.user_id = u.id 
       WHERE u.role = 'guru'`
    );
    console.log(" GURU:");
    gurus.forEach((g) => {
      console.log(`   Name: ${g.name}`);
      console.log(`   Email: ${g.email}`);
      console.log(`   NIP: ${g.nip || "-"}`);
      console.log(`   Password: ${passwords.guru}\n`);
    });

    // Show siswa accounts
    const [siswas] = await pool.query(
      `SELECT name, email, nis, kelas FROM users WHERE role = 'siswa'`
    );
    console.log("🎓 SISWA:");
    siswas.forEach((s) => {
      console.log(`   Name: ${s.name}`);
      console.log(`   Email: ${s.email}`);
      console.log(`   NIS: ${s.nis || "-"}`);
      console.log(`   Kelas: ${s.kelas || "-"}`);
      console.log(`   Password: ${passwords.siswa}\n`);
    });

    console.log("========================================");
    console.log("  Tips Login:");
    console.log("  - Admin: Gunakan email admin");
    console.log("  - Guru:  Gunakan NIP atau email");
    console.log("  - Siswa: Gunakan NIS atau email");
    console.log("========================================\n");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    await pool.end();
  }
}

resetPasswords();
