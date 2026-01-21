// app/api/borrowings/route.js
import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// SISWA AJUKAN KONSELING
export async function POST(req) {
  const session = await getServerSession(authOptions);

  // Hanya siswa yang boleh mengajukan
  if (!session || session.user.role !== "siswa") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { guru_id, tanggal, jam, alasan } = await req.json();

    // Validasi input
    if (!guru_id || !tanggal || !jam || !alasan?.trim()) {
      return NextResponse.json(
        { error: "Lengkapi semua data" },
        { status: 400 }
      );
    }

    // Pastikan guru valid
    const [guru] = await pool.query(
      "SELECT id FROM users WHERE id = ? AND role = 'guru'",
      [guru_id]
    );

    if (guru.length === 0) {
      return NextResponse.json(
        { error: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek jadwal bentrok (kecuali jika sudah rejected)
    const [bentrok] = await pool.query(
      `SELECT id 
       FROM borrowings 
       WHERE guru_id = ? 
       AND tanggal = ? 
       AND jam = ? 
       AND status != 'rejected'`,
      [guru_id, tanggal, jam]
    );

    if (bentrok.length > 0) {
      return NextResponse.json(
        { error: "Jam sudah dibooking siswa lain" },
        { status: 409 }
      );
    }

    // Simpan pengajuan
    await pool.query(
      `INSERT INTO borrowings (siswa_id, guru_id, tanggal, jam, alasan, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
      [session.user.id, guru_id, tanggal, jam, alasan.trim()]
    );

    return NextResponse.json(
      { success: true, message: "Pengajuan berhasil dikirim!" },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST /api/borrowings error:", error);
    return NextResponse.json(
      { error: "Server error", detail: error.message },
      { status: 500 }
    );
  }
}
