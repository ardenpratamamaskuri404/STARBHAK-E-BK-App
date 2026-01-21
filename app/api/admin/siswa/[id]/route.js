// app/api/admin/siswa/[id]/route.js

import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import bcrypt from "bcryptjs";

let connection;

// ====================
// PUT — Update Siswa
// ====================
export async function PUT(req, { params }) {
  const { id } = await params; // HARUS await params!

  try {
    const body = await req.json();
    const {
      name, email, phone = null,
      password,
      nis, tanggal_lahir = null, alamat = null,
      kelas_id = null, emergency_contact = null
    } = body;

    if (!id || !name || !email || !nis) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Cek email duplikat (kecuali diri sendiri)
    const [emailCheck] = await connection.query(
      "SELECT id FROM users WHERE email = ? AND id != ?", [email, id]
    );
    if (emailCheck.length > 0) {
      await connection.rollback();
      return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
    }

    // Cek NIS duplikat
    const [nisCheck] = await connection.query(
      "SELECT user_id FROM siswa_profile WHERE nis = ? AND user_id != ?", [nis, id]
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

    // Update tabel users
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      await connection.query(
        `UPDATE users 
         SET name = ?, email = ?, phone = ?, password = ? 
         WHERE id = ? AND role = 'siswa'`,
        [name, email, phone, hashed, id]
      );
    } else {
      await connection.query(
        `UPDATE users 
         SET name = ?, email = ?, phone = ? 
         WHERE id = ? AND role = 'siswa'`,
        [name, email, phone, id]
      );
    }

    // Update siswa_profile (jika belum ada, insert — jarang terjadi)
    const [profileCheck] = await connection.query(
      "SELECT user_id FROM siswa_profile WHERE user_id = ?", [id]
    );

    if (profileCheck.length === 0) {
      await connection.query(
        `INSERT INTO siswa_profile 
         (user_id, nis, tanggal_lahir, alamat, kelas_id, emergency_contact)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, nis, tanggal_lahir, alamat, kelas_id, emergency_contact]
      );
    } else {
      await connection.query(
        `UPDATE siswa_profile 
         SET nis = ?, tanggal_lahir = ?, alamat = ?, kelas_id = ?, emergency_contact = ?
         WHERE user_id = ?`,
        [nis, tanggal_lahir, alamat, kelas_id, emergency_contact, id]
      );
    }

    await connection.commit();

    return NextResponse.json(
      { success: true, message: "Siswa berhasil diperbarui!" },
      { status: 200 }
    );

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("PUT /api/admin/siswa/[id] ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Gagal update siswa" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// ====================
// DELETE — Hapus Siswa
// ====================
export async function DELETE(req, { params }) {
  const { id } = await params; // HARUS await params!

  try {
    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const [result] = await pool.query(
      "DELETE FROM users WHERE id = ? AND role = 'siswa'",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Siswa berhasil dihapus!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE /api/admin/siswa/[id] ERROR:", error);
    return NextResponse.json(
      { error: "Gagal menghapus siswa" },
      { status: 500 }
    );
  }
}