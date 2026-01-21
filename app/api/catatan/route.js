import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/database";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id");

    let sql = `
      SELECT c.*, u.name AS teacher_name 
      FROM catatan_siswa c
      JOIN users u ON u.id = c.teacher_id
    `;
    let params = [];

    // siswa hanya boleh lihat catatan miliknya
    if (session.user.role === "siswa") {
      sql += " WHERE c.student_id = ?";
      params = [session.user.id];
    }

    // guru BK dapat filter siswa
    else if (session.user.role === "guru") {
      sql += " WHERE c.teacher_id = ?";
      params = [session.user.id];

      if (studentId) {
        sql += " AND c.student_id = ?";
        params.push(studentId);
      }
    }

    sql += " ORDER BY c.created_at DESC";

    const hasil = await query(sql, params);

    return Response.json({ success: true, data: hasil });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
