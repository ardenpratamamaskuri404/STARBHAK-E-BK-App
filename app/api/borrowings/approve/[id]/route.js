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
    await pool.query(
      `UPDATE borrows 
       SET status = 'approved', approved_at = NOW()
       WHERE id = ? AND teacher_id = ?`,
      [id, session.user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json({ error: "Gagal approve" }, { status: 500 });
  }
}
