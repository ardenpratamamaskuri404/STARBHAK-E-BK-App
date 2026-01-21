import { NextResponse } from "next/server";
import { pool } from "@/lib/database"; // ← ganti ini bukan mysql

export async function POST(req) {
  try {
    const body = await req.json();
    const { student_id, teacher_id, judul, isi, kategori } = body;

    await pool.execute(
      `INSERT INTO catatan_siswa (student_id, teacher_id, judul, isi, kategori)
       VALUES (?, ?, ?, ?, ?)`,
      [student_id, teacher_id, judul, isi, kategori]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
