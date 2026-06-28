import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                b.id,
                b.title,
                b.description,
                b.type,
                b.status,
                b.requested_at,
                b.scheduled_at,
                b.approved_at,
                b.completed_at,
                s.name AS siswa_name,
                s.email AS siswa_email,
                s.nis AS siswa_nis,
                t.name AS guru_name,
                t.email AS guru_email,
                k.nama AS kelas_nama
            FROM borrows b
            JOIN users s ON s.id = b.student_id
            LEFT JOIN users t ON t.id = b.teacher_id
            LEFT JOIN siswa_profile sp ON sp.user_id = s.id
            LEFT JOIN kelas k ON k.id = sp.kelas_id
            ORDER BY b.requested_at DESC
        `);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("LIST-BORROWINGS ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
