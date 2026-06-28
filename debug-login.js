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

async function debugLogin() {
  const pool = mysql.createPool({
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    database: envVars.DB_NAME,
  });

  try {
    console.log("\n🔍 DEBUG LOGIN ISSUE...\n");

    // Check if admin has password
    const [users] = await pool.query("SELECT id, name, email, role, password FROM users WHERE email = 'admin@tb.sch.id'");
    
    if (users.length === 0) {
      console.log("❌ Admin user not found!");
    } else {
      const user = users[0];
      console.log("📋 Admin user found:");
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password hash: ${user.password ? user.password.substring(0, 20) + '...' : 'NULL'}`);
      
      // Test password
      const testPassword = "admin123";
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`\n🔑 Password test (admin123): ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (!isValid) {
        console.log("\n⚠️  Password doesn't match! Resetting...");
        const newHash = await bcrypt.hash(testPassword, 10);
        await pool.query("UPDATE users SET password = ? WHERE id = ?", [newHash, user.id]);
        console.log("✅ Password reset successfully!");
        
        // Verify again
        const [updated] = await pool.query("SELECT password FROM users WHERE id = ?", [user.id]);
        const isValid2 = await bcrypt.compare(testPassword, updated[0].password);
        console.log(` Verification: ${isValid2 ? '✅ VALID' : '❌ STILL INVALID'}`);
      }
    }

    // Also test the actual query from auth route
    console.log("\n\n🔍 Testing auth query...");
    const identifier = "admin@tb.sch.id";
    const [rows] = await pool.query(
      `SELECT u.* FROM users u LEFT JOIN guru_profile gp ON gp.user_id = u.id WHERE u.email = ? OR u.nis = ? OR gp.nip = ? LIMIT 1`,
      [identifier, identifier, identifier]
    );
    
    console.log(`Query result: ${rows.length} row(s)`);
    if (rows.length > 0) {
      console.log("User found:", rows[0].name, rows[0].email);
    }

  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    await pool.end();
  }
}

debugLogin();
