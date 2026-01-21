import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function GET() {
    try {
        const data = await query(`
            SELECT 
                sp.user_id AS id,
                u.name AS nama,
                sp.nis,
                k.nama AS kelas,
                u.email,
                u.phone,
                u.avatar_url,
                u.is_active,
                u.created_at
            FROM siswa_profile sp
            JOIN users u ON sp.user_id = u.id
            LEFT JOIN kelas k ON sp.kelas_id = k.id
            ORDER BY sp.user_id DESC
        `);

        return NextResponse.json(data);
    } catch (err) {
        console.error("LIST-STUDENTS ERROR:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
