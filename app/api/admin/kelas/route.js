import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET() {
    const [rows] = await pool.query("SELECT id, nama FROM kelas ORDER BY nama ASC");
    return NextResponse.json(rows);
}

export async function POST(req) {
    const { nama } = await req.json();

    await pool.query("INSERT INTO kelas (nama) VALUES (?)", [nama]);

    return NextResponse.json({ message: "Kelas ditambahkan" });
}
