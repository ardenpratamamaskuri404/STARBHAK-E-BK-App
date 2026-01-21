import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "guru") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows] = await pool.query(
      `SELECT b.id, 
              b.description AS alasan,
              b.requested_at,
              s.name AS siswa_name,
              sp.nis AS siswa_nis,
              k.nama AS kelas_nama
       FROM borrows b
       JOIN users s ON b.student_id = s.id
       LEFT JOIN siswa_profile sp ON sp.user_id = s.id
       LEFT JOIN kelas k ON k.id = sp.kelas_id
       WHERE b.teacher_id = ? 
         AND b.status = 'pending'
       ORDER BY b.requested_at ASC`,
      [session.user.id]
    );

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error("Pending error:", error);
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}
