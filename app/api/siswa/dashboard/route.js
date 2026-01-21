import { query } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "siswa") {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const studentId = session.user.id;

    // === 1. TOTAL PENGAJUAN KONSELING ===
    const total = await query(
      "SELECT COUNT(*) AS total FROM borrows WHERE student_id = ?",
      [studentId]
    );

    // === 2. TOTAL SELESAI ===
    const selesai = await query(
      "SELECT COUNT(*) AS selesai FROM borrows WHERE student_id = ? AND status = 'completed'",
      [studentId]
    );

    // === 3. PENGAJUAN TERBARU ===
    const terbaru = await query(
      `SELECT b.*, u.name AS teacher_name
       FROM borrows b
       LEFT JOIN users u ON u.id = b.teacher_id
       WHERE b.student_id = ?
       ORDER BY b.requested_at DESC
       LIMIT 1`,
      [studentId]
    );

    // === 4. JADWAL TERDEKAT ===
    const upcoming = await query(
      `SELECT j.*, u.name AS teacher_name
       FROM jadwal_konseling j
       LEFT JOIN users u ON u.id = j.teacher_id
       WHERE j.student_id = ? 
         AND j.scheduled_datetime > NOW()
       ORDER BY j.scheduled_datetime ASC
       LIMIT 1`,
      [studentId]
    );

    return Response.json({
      success: true,
      data: {
        total: total[0]?.total ?? 0,
        selesai: selesai[0]?.selesai ?? 0,
        terbaru: terbaru[0] ?? null,
        upcoming: upcoming[0] ?? null,
      },
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
