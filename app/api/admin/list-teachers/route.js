import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function GET() {
    try {
        const data = await query(`
            SELECT 
                gp.user_id AS id,
                gp.nip,
                gp.mata_pelajaran,
                gp.jabatan,
                u.name,
                u.email,
                u.phone,
                u.avatar_url,
                u.is_active,
                u.created_at
            FROM guru_profile gp
            JOIN users u ON gp.user_id = u.id
            ORDER BY gp.user_id DESC
        `);

        return NextResponse.json(data);
    } catch (err) {
        console.error("LIST-TEACHERS ERROR:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
