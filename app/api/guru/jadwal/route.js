import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "guru") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacherId = session.user.id;

    // Ambil jadwal konseling guru
    const hasil = await query(
      `
      SELECT 
        b.id,
        b.title,
        b.description,
        b.scheduled_at,
        DATE(b.scheduled_at) AS scheduled_date,
        TIME(b.scheduled_at) AS scheduled_time,
        u.name AS student_name,
        u.email AS student_email
      FROM borrows b
      JOIN users u ON u.id = b.student_id
      WHERE b.teacher_id = ?
        AND b.status = 'approved'
        AND b.scheduled_at IS NOT NULL
      ORDER BY b.scheduled_at ASC
      `,
      [teacherId]
    );

    return Response.json({
      success: true,
      jadwal: hasil ?? []
    });
  } catch (error) {
    console.error("JADWAL ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
