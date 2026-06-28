// app/api/guru/home/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/database";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "guru") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const guruId = session.user.id;

    const profile = await query(
      `SELECT id, name, email FROM users WHERE id = ?`,
      [guruId]
    );

    const pengajuanMasuk = await query(
      `SELECT COUNT(*) AS total FROM borrows WHERE teacher_id = ? AND status = 'pending'`,
      [guruId]
    );

    // ===== FIX: gunakan scheduled_at dan alias ke scheduled_datetime =====
    const jadwalHariIni = await query(
      `
      SELECT 
        b.id,
        b.scheduled_at,
        -- alias supaya frontend tidak perlu diubah
        b.scheduled_at AS scheduled_datetime,
        s.name AS student_name
      FROM borrows b
      JOIN users s ON s.id = b.student_id
      WHERE b.teacher_id = ?
        AND DATE(b.scheduled_at) = CURDATE()
        AND b.status = 'approved'
      ORDER BY b.scheduled_at
      `,
      [guruId]
    );

    const riwayat = await query(
      `
      SELECT 
        b.id,
        s.name AS student_name,
        b.description AS summary,
        b.requested_at
      FROM borrows b
      JOIN users s ON s.id = b.student_id
      WHERE b.teacher_id = ?
        AND b.status IN ('completed', 'approved')
      ORDER BY b.requested_at DESC
      LIMIT 10
      `,
      [guruId]
    );

    return Response.json({
      success: true,
      profile: profile[0] ?? null,
      pengajuanMasuk: pengajuanMasuk[0]?.total ?? 0,
      jadwalHariIni: jadwalHariIni ?? [],
      riwayat: riwayat ?? []
    });

  } catch (err) {
    console.error("ERROR API GURU HOME:", err);
    return Response.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
