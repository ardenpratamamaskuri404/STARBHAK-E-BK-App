import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Total students
        const [students] = await pool.query(
            "SELECT COUNT(*) AS total FROM users WHERE role = 'siswa' AND is_active = 1"
        );

        // Total teachers
        const [teachers] = await pool.query(
            "SELECT COUNT(*) AS total FROM users WHERE role = 'guru' AND is_active = 1"
        );

        // Total borrowings by status
        const [statusStats] = await pool.query(`
            SELECT 
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
                COUNT(*) AS total
            FROM borrows
        `);

        // Borrowings today
        const [today] = await pool.query(
            "SELECT COUNT(*) AS total FROM borrows WHERE DATE(requested_at) = CURDATE()"
        );

        // Monthly chart data
        const [monthly] = await pool.query(`
            SELECT 
                MONTH(requested_at) AS month,
                COUNT(*) AS total
            FROM borrows
            WHERE YEAR(requested_at) = YEAR(CURDATE())
            GROUP BY MONTH(requested_at)
            ORDER BY month
        `);

        // Recent activity
        const [recent] = await pool.query(`
            SELECT 
                b.id,
                b.title,
                b.status,
                b.requested_at,
                s.name AS siswa_name,
                t.name AS guru_name
            FROM borrows b
            JOIN users s ON s.id = b.student_id
            LEFT JOIN users t ON t.id = b.teacher_id
            ORDER BY b.requested_at DESC
            LIMIT 10
        `);

        // Top students (most borrowings)
        const [topStudents] = await pool.query(`
            SELECT 
                s.name,
                s.nis,
                COUNT(b.id) AS total
            FROM borrows b
            JOIN users s ON s.id = b.student_id
            GROUP BY s.id, s.name, s.nis
            ORDER BY total DESC
            LIMIT 5
        `);

        const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        const monthlyData = monthly.map(m => ({
            month: monthNames[m.month] || "-",
            total: Number(m.total)
        }));

        return NextResponse.json({
            success: true,
            stats: {
                totalStudents: Number(students[0]?.total || 0),
                totalTeachers: Number(teachers[0]?.total || 0),
                pending: Number(statusStats[0]?.pending || 0),
                approved: Number(statusStats[0]?.approved || 0),
                rejected: Number(statusStats[0]?.rejected || 0),
                completed: Number(statusStats[0]?.completed || 0),
                totalBorrowings: Number(statusStats[0]?.total || 0),
                todayBorrowings: Number(today[0]?.total || 0),
            },
            monthly: monthlyData,
            recent: recent || [],
            topStudents: topStudents || []
        });

    } catch (error) {
        console.error("ADMIN DASHBOARD ERROR:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
