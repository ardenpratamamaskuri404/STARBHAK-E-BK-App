import { query } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // ⛔ Validasi sesi dan role siswa
    if (!session || session.user.role !== "siswa") {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const studentId = session.user.id;

    // 🔧 FIX: teacher_id bisa null → gunakan COALESCE
    const sql = `
      SELECT 
        b.id,
        b.status,
        b.description,
        b.requested_at,
        b.approved_at,
        b.rejected_at,
        b.completed_at,
        COALESCE(u.name, 'Guru Tidak Ditemukan') AS teacher_name
      FROM borrows b
      LEFT JOIN users u ON b.teacher_id = u.id
      WHERE b.student_id = ?
      ORDER BY b.requested_at DESC
    `;

    // 🔧 FIX: studentId tidak boleh undefined
    const rows = await query(sql, [studentId ?? null]);

    return Response.json({
      success: true,
      riwayat: rows,
    });

  } catch (err) {
    console.error("RIWAYAT ERROR:", err);
    return Response.json(
      { success: false, message: "Gagal mengambil riwayat" },
      { status: 500 }
    );
  }
}
