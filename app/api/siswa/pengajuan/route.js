// app/api/siswa/pengajuan/route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "siswa") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { teacher_id, reason } = body;

    if (!teacher_id || !reason?.trim()) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const studentId = session.user.id;

    // ========== VALIDASI: Guru Harus Ada ==========
    const guru = await query(
      "SELECT id FROM users WHERE id = ? AND role = 'guru' LIMIT 1",
      [teacher_id]
    );
    if (guru.length === 0) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    const cekPending = await query(
  "SELECT id FROM borrows WHERE student_id = ? AND status = 'pending'",
  [studentId]
);

if (cekPending.length > 0) {
  return NextResponse.json(
    { success: false, message: 'Kamu masih punya pengajuan pending' },
    { status: 409 }
  );
}


    // ========== INSERT KE TABLE BORROWS ==========
    await query(
      `INSERT INTO borrows 
        (student_id, teacher_id, type, title, description, status, requested_at)
       VALUES (?, ?, 'konseling', ?, ?, 'pending', NOW())`,
      [studentId, teacher_id, "Pengajuan Konseling", reason.trim()]
    );

    return NextResponse.json(
      { success: true, message: "Pengajuan konseling berhasil dibuat" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/siswa/pengajuan error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        detail: error.message, // biar tau errornya apa
      },
      { status: 500 }
    );
  }
}
