import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/database";

export const dynamic = "force-dynamic"; // memastikan data fresh

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "guru") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacherId = session.user.id;

    const pengajuan = await query(
      `
      SELECT 
        b.id,
        b.student_id,
        b.title,
        b.description,
        b.requested_at,
        u.name AS student_name,
        u.email AS student_email
      FROM borrows b
      JOIN users u ON u.id = b.student_id
      WHERE b.status = 'pending'
        AND b.teacher_id = ?
      ORDER BY b.requested_at DESC
      `,
      [teacherId]
    );

    return Response.json(
      {
        status: "success",
        total: pengajuan.length,
        pengajuan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error /api/guru/pengajuan:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
