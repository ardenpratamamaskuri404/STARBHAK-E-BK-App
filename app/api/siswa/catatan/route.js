import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/database";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "siswa") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = session.user.id;

    const data = await query(
      `
      SELECT 
        c.id,
        c.judul,
        c.isi,
        c.kategori,
        c.created_at,
        u.name AS teacher_name
      FROM catatan_siswa c
      JOIN users u ON u.id = c.teacher_id
      WHERE c.student_id = ?
      ORDER BY c.created_at DESC
      `,
      [studentId]
    );

    return Response.json({ catatan: data });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
