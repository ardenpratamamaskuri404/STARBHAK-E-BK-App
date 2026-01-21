// app/api/admin/siswa/route.js

import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import bcrypt from "bcryptjs";

let connection;

// ====================
// GET — Semua Siswa
// ====================
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id, u.name, u.email, u.phone,
        sp.nis, sp.tanggal_lahir, sp.alamat, sp.emergency_contact,
        sp.kelas_id, k.nama AS nama_kelas
      FROM users u
      LEFT JOIN siswa_profile sp ON sp.user_id = u.id
      LEFT JOIN kelas k ON k.id = sp.kelas_id
      WHERE u.role = 'siswa' AND u.is_active = 1
      ORDER BY u.name ASC
    `);

    const formatted = rows.map(row => ({
      id: row.id,
      name: row.name || "-",
      email: row.email || "-",
      phone: row.phone || "",
      nis: row.nis || "-",
      tanggal_lahir: row.tanggal_lahir 
        ? new Date(row.tanggal_lahir).toISOString().split("T")[0]
        : "",
      alamat: row.alamat || "",
      emergency_contact: row.emergency_contact || "",
      kelas_id: row.kelas_id || null,
      nama_kelas: row.nama_kelas || "Belum ada kelas"
    }));

    return NextResponse.json({ data: formatted }, { status: 200 });

  } catch (error) {
    console.error("GET /api/admin/siswa ERROR:", error);
    return NextResponse.json({ error: "Gagal memuat data siswa" }, { status: 500 });
  }
}

// ====================
// POST — Tambah Siswa
// ====================
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name, email, phone = null,
      password, nis,
      tanggal_lahir = null, alamat = null,
      kelas_id = null, emergency_contact = null
    } = body;

    // Validasi wajib
    if (!name || !email || !password || !nis) {
      return NextResponse.json(
        { error: "Nama, Email, Password, dan NIS wajib diisi!" },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Cek email duplikat
    const [emailCheck] = await connection.query(
      "SELECT id FROM users WHERE email = ?", [email]
    );
    if (emailCheck.length > 0) {
      await connection.rollback();
      return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
    }

    // Cek NIS duplikat
    const [nisCheck] = await connection.query(
      "SELECT user_id FROM siswa_profile WHERE nis = ?", [nis]
    );
    if (nisCheck.length > 0) {
      await connection.rollback();
      return NextResponse.json({ error: "NIS sudah digunakan" }, { status: 400 });
    }

    // Validasi kelas_id jika ada
    if (kelas_id) {
      const [kelasCheck] = await connection.query(
        "SELECT id FROM kelas WHERE id = ?", [kelas_id]
      );
      if (kelasCheck.length === 0) {
        await connection.rollback();
        return NextResponse.json({ error: "Kelas tidak ditemukan!" }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert ke users
    const [userResult] = await connection.query(
      `INSERT INTO users (name, email, phone, password, role)
       VALUES (?, ?, ?, ?, 'siswa')`,
      [name, email, phone, hashedPassword]
    );

    const user_id = userResult.insertId;

    // Insert ke siswa_profile
    await connection.query(
      `INSERT INTO siswa_profile 
         (user_id, nis, tanggal_lahir, alamat, kelas_id, emergency_contact)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, nis, tanggal_lahir, alamat, kelas_id, emergency_contact]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Siswa berhasil ditambahkan!",
      user_id
    }, { status: 201 });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("POST /api/admin/siswa ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menambahkan siswa" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}