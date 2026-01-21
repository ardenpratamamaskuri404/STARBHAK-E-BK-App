import { query } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "guru") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const teacherId = session.user.id;

    // 1. Cek apakah pengajuan ada & milik guru
    const check = await query(
      `
      SELECT teacher_id, status
      FROM borrows
      WHERE id = ?
      `,
      [id]
    );

    if (!check || check.length === 0) {
      return Response.json(
        { error: "Pengajuan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (check[0].teacher_id !== teacherId) {
      return Response.json(
        { error: "Tidak punya akses untuk menolak pengajuan ini" },
        { status: 403 }
      );
    }

    if (check[0].status !== "pending") {
      return Response.json(
        { error: "Pengajuan sudah diproses sebelumnya" },
        { status: 400 }
      );
    }

    // 2. Update status → rejected
    const result = await query(
      `
      UPDATE borrows
      SET status = 'rejected', rejected_at = NOW()
      WHERE id = ?
      `,
      [id]
    );

    return Response.json(
      {
        status: "success",
        message: "Pengajuan berhasil ditolak",
        data: { id, updated: result.affectedRows > 0 }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("REJECT ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
