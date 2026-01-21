import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function GET() {
  const rows = await query(`SELECT * FROM notifications ORDER BY created_at DESC`);
  return NextResponse.json(rows);
}

export async function POST(req) {
  const { user_id, message } = await req.json();

  await query(
    `INSERT INTO notifications (user_id, message, created_at)
     VALUES (?, ?, NOW())`,
    [user_id, message]
  );

  return NextResponse.json({ message: "Notifikasi dikirim!" });
}
