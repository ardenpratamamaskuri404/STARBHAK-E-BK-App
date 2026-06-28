import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "guru") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const guruId = session.user.id;

    if (!guruId) {
      return Response.json({ success: false, error: "ID guru tidak ditemukan" }, { status: 400 });
    }

    const riwayat = await query(
      `
      SELECT 
        b.id,
        b.status,
        b.description,
        b.requested_at,
        b.scheduled_at,
        u.name AS siswa_name
      FROM borrows b
      JOIN users u ON u.id = b.student_id
      WHERE b.teacher_id = ?
        AND b.status IN ('approved', 'completed')
      ORDER BY b.requested_at DESC
      `,
      [guruId]
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
