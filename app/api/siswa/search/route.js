import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET(req) {
  const { search } = Object.fromEntries(req.nextUrl.searchParams);

  const [rows] = await pool.execute(
    `SELECT u.id, u.name, sp.nis, k.nama AS kelas
     FROM users u
     LEFT JOIN siswa_profile sp ON sp.user_id = u.id
     LEFT JOIN kelas k ON k.id = sp.kelas_id
     WHERE u.role='siswa'
     AND (u.name LIKE ? OR sp.nis LIKE ?)
     LIMIT 10`,
    [`%${search}%`, `%${search}%`]
  );

  return NextResponse.json(rows);
}
