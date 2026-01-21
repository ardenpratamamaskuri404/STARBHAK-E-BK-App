// app/api/siswa/laporan/route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "siswa") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const siswaId = session.user.id;

    const laporan = await query(
      `SELECT 
          l.id,
          l.jadwal_id,
          l.student_id,
          l.teacher_id,
          l.summary,
          l.detail,
          l.follow_up,
          l.created_at,
          u.name AS teacher_name
       FROM laporan_konseling l
       JOIN users u ON l.teacher_id = u.id
       WHERE l.student_id = ?
       ORDER BY l.created_at DESC`,
      [siswaId]
    );

    return NextResponse.json(
      { success: true, data: laporan },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET /api/siswa/laporan error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", detail: error.message },
      { status: 500 }
    );
  }
}
