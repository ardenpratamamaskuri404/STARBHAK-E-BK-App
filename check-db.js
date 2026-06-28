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

async function checkDB() {
  const pool = mysql.createPool({
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    database: envVars.DB_NAME,
  });

  try {
    console.log("\n🔍 CHECKING DATABASE STATUS...\n");

    // Check if tables exist
    const [tables] = await pool.query("SHOW TABLES");
    console.log("📊 Tables found:", tables.length);
    tables.forEach((t) => console.log(`   - ${Object.values(t)[0]}`));

    // Check users count
    const [users] = await pool.query("SELECT COUNT(*) as total FROM users");
    console.log(`\n Total users: ${users[0].total}`);

    if (users[0].total > 0) {
      const [userList] = await pool.query(
        "SELECT id, name, username, email, role FROM users"
      );
      console.log("\n📋 User list:");
      userList.forEach((u) => {
        console.log(`   [${u.role}] ${u.name} (${u.email}) - username: ${u.username || "-"}`);
      });
    } else {
      console.log("\n⚠️  NO USERS FOUND!");
      console.log("   Run: node seed.js");
    }

    // Check kelas
    const [kelas] = await pool.query("SELECT COUNT(*) as total FROM kelas");
    console.log(`\n🏫 Total kelas: ${kelas[0].total}`);

  } catch (error) {
    console.error("\n❌ Database error:", error.message);
    console.log("\n📝 Make sure:");
    console.log("   1. MySQL is running (Laragon)");
    console.log("   2. Database 'db_projectbk' exists");
    console.log("   3. Run: mysql -u root < databasebk.sql");
  } finally {
    await pool.end();
  }
}

checkDB();
