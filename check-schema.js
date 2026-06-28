import mysql from "mysql2/promise";
import { readFileSync } from "fs";

const envContent = readFileSync(".env", "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join("=").trim();
  }
});

async function checkSchema() {
  const pool = mysql.createPool({
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    database: envVars.DB_NAME,
  });

  try {
    console.log("\n🔍 CHECKING TABLE SCHEMAS...\n");

    const tables = ["users", "siswa_profile", "guru_profile", "kelas", "borrows", "borrowings"];

    for (const table of tables) {
      try {
        const [columns] = await pool.query(`DESCRIBE ${table}`);
        console.log(`\n📋 ${table}:`);
        columns.forEach((col) => {
          console.log(`   - ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });
      } catch (e) {
        console.log(`\n❌ ${table}: ${e.message}`);
      }
    }

    // Show all users
    console.log("\n\n👥 ALL USERS:");
    const [users] = await pool.query("SELECT * FROM users");
    users.forEach((u) => {
      console.log(`\n   ID: ${u.id}`);
      console.log(`   Name: ${u.name}`);
      console.log(`   Email: ${u.email}`);
      console.log(`   Role: ${u.role}`);
      if (u.username) console.log(`   Username: ${u.username}`);
      if (u.phone) console.log(`   Phone: ${u.phone}`);
    });

  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
