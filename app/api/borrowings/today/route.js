// app/api/borrowings/today/route.js
import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Menggunakan timezone lokal (WIB) → aman untuk Indonesia
  const today = new Date().toISOString().split("T")[0];

  try {
    const [rows] = await pool.query(
      `SELECT 
          b.id,
          b.tanggal,
          b.jam,
          b.alasan,
          b.status,
          b.created_at,
          s.name AS siswa_name,
          s.nis AS siswa_nis,
          k.nama AS kelas_nama
       FROM borrowings b
       JOIN users s ON b.siswa_id = s.id
       LEFT JOIN siswa_profile sp ON sp.user_id = s.id
       LEFT JOIN kelas k ON k.id = sp.kelas_id
       WHERE b.guru_id = ? AND b.tanggal = ?
       ORDER BY b.jam ASC`,
      [session.user.id, today]
    );

    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memuat jadwal hari ini", detail: error.message },
      { status: 500 }
    );
  }
}
