// app/api/borrowings/reject/[id]/route.js
import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const [result] = await pool.query(
      "UPDATE borrowings SET status = 'rejected' WHERE id = ? AND guru_id = ?",
      [id, session.user.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal reject", detail: error.message },
      { status: 500 }
    );
  }
}
