import { NextResponse } from "next/server";
import { query } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, username, email, password } = await req.json();

        const hashed = await bcrypt.hash(password, 10);

        await query(
            `INSERT INTO users (name, username, email, password, role_id)
       VALUES (?, ?, ?, ?, 2)`,
            [name, username, email, hashed]
        );

        return NextResponse.json({ message: "Guru BK berhasil dibuat!" });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
