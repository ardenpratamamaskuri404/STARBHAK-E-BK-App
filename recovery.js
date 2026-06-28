import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import readline from "readline";
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const pool = mysql.createPool({
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    database: envVars.DB_NAME,
  });

  try {
    console.log("\n========================================");
    console.log("  RECOVERY & RESET AKUN - EBK APP");
    console.log("========================================\n");

    // Tampilkan semua akun yang ada
    console.log("📋 DAFTAR AKUN YANG TERDAFTAR DI DATABASE:\n");

    const [admins] = await pool.query(
      "SELECT id, name, username, email, role FROM users WHERE role = 'admin' AND is_active = 1"
    );

    const [gurus] = await pool.query(
      `SELECT u.id, u.name, u.username, u.email, gp.nip, gp.mata_pelajaran
       FROM users u
       LEFT JOIN guru_profile gp ON gp.user_id = u.id
       WHERE u.role = 'guru' AND u.is_active = 1`
    );

    const [siswas] = await pool.query(
      `SELECT u.id, u.name, u.username, u.email, sp.nis, k.nama AS kelas
       FROM users u
       LEFT JOIN siswa_profile sp ON sp.user_id = u.id
       LEFT JOIN kelas k ON k.id = sp.kelas_id
       WHERE u.role = 'siswa' AND u.is_active = 1`
    );

    if (admins.length > 0) {
      console.log("🔑 ADMIN:");
      admins.forEach((a) => {
        console.log(`   - Name: ${a.name}`);
        console.log(`     Username: ${a.username || "-"}`);
        console.log(`     Email: ${a.email}`);
        console.log("");
      });
    }

    if (gurus.length > 0) {
      console.log("‍🏫 GURU BK:");
      gurus.forEach((g) => {
        console.log(`   - Name: ${g.name}`);
        console.log(`     Username: ${g.username || "-"}`);
        console.log(`     Email: ${g.email}`);
        console.log(`     NIP: ${g.nip || "-"}`);
        console.log(`     Mata Pelajaran: ${g.mata_pelajaran || "-"}`);
        console.log("");
      });
    }

    if (siswas.length > 0) {
      console.log("‍🎓 SISWA:");
      siswas.forEach((s) => {
        console.log(`   - Name: ${s.name}`);
        console.log(`     Username: ${s.username || "-"}`);
        console.log(`     Email: ${s.email}`);
        console.log(`     NIS: ${s.nis || "-"}`);
        console.log(`     Kelas: ${s.kelas || "-"}`);
        console.log("");
      });
    }

    if (admins.length === 0 && gurus.length === 0 && siswas.length === 0) {
      console.log("⚠️  Tidak ada akun yang terdaftar di database.");
      console.log("   Jalankan seed.js untuk membuat akun baru.\n");
      await pool.end();
      process.exit(0);
    }

    // Tanya user mau reset password siapa
    console.log("\n========================================");
    console.log("  RESET PASSWORD");
    console.log("========================================\n");
    console.log("Pilih akun yang ingin di-reset passwordnya:");
    console.log("1. Admin");
    console.log("2. Guru");
    console.log("3. Siswa");
    console.log("4. Reset semua akun");
    console.log("0. Keluar\n");

    const choice = await ask("Pilihan (0-4): ");

    if (choice === "0") {
      console.log("\n Keluar dari program.");
      await pool.end();
      process.exit(0);
    }

    let usersToReset = [];

    if (choice === "1") {
      usersToReset = admins.map((a) => ({ id: a.id, name: a.name, role: "admin" }));
    } else if (choice === "2") {
      usersToReset = gurus.map((g) => ({ id: g.id, name: g.name, role: "guru" }));
    } else if (choice === "3") {
      usersToReset = siswas.map((s) => ({ id: s.id, name: s.name, role: "siswa" }));
    } else if (choice === "4") {
      usersToReset = [
        ...admins.map((a) => ({ id: a.id, name: a.name, role: "admin" })),
        ...gurus.map((g) => ({ id: g.id, name: g.name, role: "guru" })),
        ...siswas.map((s) => ({ id: s.id, name: s.name, role: "siswa" })),
      ];
    } else {
      console.log("\n❌ Pilihan tidak valid.");
      await pool.end();
      process.exit(1);
    }

    const newPassword = await ask("\nMasukkan password baru: ");

    if (!newPassword || newPassword.trim() === "") {
      console.log("\n❌ Password tidak boleh kosong.");
      await pool.end();
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    for (const user of usersToReset) {
      await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id]);
      console.log(`✅ Password ${user.role} "${user.name}" berhasil di-reset.`);
    }

    console.log("\n========================================");
    console.log("  PASSWORD BERHASIL DI-RESET!");
    console.log("========================================\n");
    console.log(`Password baru untuk semua akun yang dipilih: ${newPassword}`);
    console.log("\n Tips Login:");
    console.log("   - Admin: Gunakan username atau email admin");
    console.log("   - Guru:  Gunakan NIP atau email guru");
    console.log("   - Siswa: Gunakan NIS atau email siswa");
    console.log("");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    rl.close();
    await pool.end();
  }
}

main();
