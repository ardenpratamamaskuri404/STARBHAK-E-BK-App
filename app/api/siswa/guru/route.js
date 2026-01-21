import { query } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Hanya siswa yang boleh mengakses list guru
    if (!session || session.user.role !== "siswa") {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const sql = `
      SELECT 
        u.id, 
        u.name, 
        COALESCE(gp.jabatan, 'Guru') AS jabatan
      FROM users u
      LEFT JOIN guru_profile gp ON u.id = gp.user_id
      WHERE u.role = 'guru'
      ORDER BY u.name ASC
    `;

    const guru = await query(sql);

    return Response.json({
      success: true,
      data: guru,
    });

  } catch (err) {
    console.error("GURU LIST ERROR:", err);
    return Response.json(
      { success: false, message: "Gagal mengambil data guru" },
      { status: 500 }
    );
  }
}
