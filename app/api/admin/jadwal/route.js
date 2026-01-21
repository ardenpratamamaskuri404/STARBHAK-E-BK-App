// app/api/admin/jadwal/route.js
import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                j.id,
                j.scheduled_datetime,
                j.duration_minutes,
                j.lokasi,
                j.status,
                s.name AS siswa_name,
                g.name AS guru_name
            FROM jadwal_konseling j
            JOIN users s ON s.id = j.student_id
            JOIN users g ON g.id = j.teacher_id
            ORDER BY j.scheduled_datetime DESC
        `);
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: "Gagal load jadwal" }, { status: 500 });
    }
}

// PATCH untuk approve/reject
export async function PATCH(request, { params }) {
    const { id } = params;
    const { status } = await request.json();

    try {
        await pool.query("UPDATE jadwal_konseling SET status = ? WHERE id = ?", [status, id]);
        return NextResponse.json({ message: "Status updated" });
    } catch (error) {
        return NextResponse.json({ error: "Gagal update" }, { status: 500 });
    }
}