import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "siswa") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const siswaId = session.user.id;

    if (!siswaId) {
      return Response.json({ success: false, error: "ID siswa tidak ditemukan" }, { status: 400 });
    }

    const riwayat = await query(
      `
      SELECT 
        b.id,
        b.status,
        b.reason,
        b.created_at,
        b.preferred_datetime,
        b.scheduled_datetime,
        u.name AS guru_name
      FROM borrows b
      JOIN users u ON u.id = b.teacher_id
      WHERE b.student_id = ?
        AND b.status IN ('approved', 'completed')
      ORDER BY b.created_at DESC
      `,
      [siswaId]
    );

    return Response.json({
      success: true,
      riwayat: riwayat ?? []
    });

  } catch (e) {
    console.error("RIWAYAT ERROR:", e);
    return Response.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
