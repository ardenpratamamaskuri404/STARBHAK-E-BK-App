import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/database";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "guru") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { judul, isi, kategori } = await req.json();

    await query(
      `UPDATE catatan_siswa SET judul=?, isi=?, kategori=? WHERE id=? AND teacher_id=?`,
      [judul, isi, kategori, id, session.user.id]
    );

    return Response.json({ success: true, message: "Catatan diperbarui" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "guru") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await query(
      `DELETE FROM catatan_siswa WHERE id=? AND teacher_id=?`,
      [id, session.user.id]
    );

    return Response.json({ success: true, message: "Catatan dihapus" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
