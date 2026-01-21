import { query } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // ⛔ Validasi akses hanya untuk siswa
    if (!session || session.user.role !== "siswa") {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const studentId = session.user.id;

    const sql = `
      SELECT 
        j.*,
        COALESCE(u.name, 'Guru Tidak Ditemukan') AS teacher_name
      FROM jadwal_konseling j
      LEFT JOIN users u ON j.teacher_id = u.id
      WHERE j.student_id = ?
      ORDER BY j.scheduled_datetime DESC
    `;

    const rows = await query(sql, [studentId ?? null]);

    return Response.json({
      success: true,
      jadwal: rows,
    });

  } catch (error) {
    console.error("JADWAL ERROR:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
