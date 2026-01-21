import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET(req) {
  const { search } = Object.fromEntries(req.nextUrl.searchParams);

  const [rows] = await pool.execute(
    `SELECT id, name, nis, kelas
     FROM users 
     WHERE role='siswa'
     AND (name LIKE ? OR nis LIKE ?)
     LIMIT 10`,
    [`%${search}%`, `%${search}%`]
  );

  return NextResponse.json(rows);
}
