// app/api/borrowings/riwayat/route.js
import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "siswa") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows] = await pool.query(
      `SELECT 
          b.id,
          b.tanggal,
          b.jam,
          b.alasan,
          b.status,
          b.created_at,
          u.name AS guru_name
       FROM borrowings b
       JOIN users u ON b.guru_id = u.id
       WHERE b.siswa_id = ?
       ORDER BY b.created_at DESC`,
      [session.user.id]
    );

    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memuat riwayat", detail: error.message },
      { status: 500 }
    );
  }
}
