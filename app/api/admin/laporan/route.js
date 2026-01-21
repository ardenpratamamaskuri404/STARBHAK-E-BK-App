// app/api/admin/laporan/route.js
import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                l.id,
                l.summary,
                l.detail,
                l.follow_up,
                l.created_at,
                j.scheduled_datetime AS jadwal_datetime,
                s.name AS siswa_name,
                g.name AS guru_name
            FROM laporan_konseling l
            JOIN jadwal_konseling j ON j.id = l.jadwal_id
            JOIN users s ON s.id = j.student_id
            JOIN users g ON g.id = j.teacher_id
            ORDER BY l.created_at DESC
        `);

        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Gagal mengambil laporan" }, { status: 500 });
    }
}