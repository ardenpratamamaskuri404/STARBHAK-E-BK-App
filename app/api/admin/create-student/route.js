import { NextResponse } from "next/server";
import { query } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, username, email, password, class_id } = await req.json();

        const hashed = await bcrypt.hash(password, 10);

        await query(
            `INSERT INTO users (name, username, email, password, role, role_id)
    VALUES (?, ?, ?, ?, 'siswa', 3)`,
            [name, username, email, hashed]
        );

        return NextResponse.json({ message: "Siswa berhasil dibuat!" });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
