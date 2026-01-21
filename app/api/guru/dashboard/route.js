import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "guru") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const guruId = session.user.id;

    // ============================
    // 📊 STATISTIK
    // ============================

    const pengajuanMasuk = await query(
      `SELECT COUNT(*) AS total 
       FROM borrows 
       WHERE teacher_id = ? AND status = 'pending'`,
      [guruId]
    );

    const jadwalHariIni = await query(
      `
      SELECT COUNT(*) AS total 
      FROM borrows 
      WHERE teacher_id = ?
      AND DATE(scheduled_at) = CURDATE()
      `,
      [guruId]
    );

    const riwayat = await query(
      `SELECT COUNT(*) AS total 
       FROM borrows 
       WHERE teacher_id = ? AND status = 'completed'`,
      [guruId]
    );

    const jumlahSiswa = await query(
      `
      SELECT COUNT(DISTINCT student_id) AS total
      FROM borrows 
      WHERE teacher_id = ?
      `,
      [guruId]
    );

    // ============================
    // 🟦 DONUT
    // ============================

    const donut = await query(
      `
      SELECT 
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed
      FROM borrows
      WHERE teacher_id = ?
      `,
      [guruId]
    );

    // ============================
    // 📅 MONTHLY CHART
    // ============================

    const monthly = await query(
      `
      SELECT 
        MONTH(scheduled_at) AS month,
        COUNT(*) AS total
      FROM borrows
      WHERE teacher_id = ?
      GROUP BY MONTH(scheduled_at)
      ORDER BY month
      `,
      [guruId]
    );

    const monthNames = [
      "", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];

    const monthlyConverted = monthly.map((m) => ({
      month: monthNames[m.month] || "-",
      total: m.total,
    }));

    // ============================
    // 🕒 AKTIVITAS TERBARU
    // ============================

    const aktivitas = await query(
      `
      SELECT 
        b.id, 
        b.title, 
        b.completed_at, 
        u.name AS student_name
      FROM borrows b
      JOIN users u ON u.id = b.student_id
      WHERE b.teacher_id = ?
      ORDER BY b.completed_at DESC
      LIMIT 5
      `,
      [guruId]
    );

    // ============================
    // 📤 JSON RESPONSE FINAL
    // ============================

    return Response.json({
      success: true,
      statistik: {
        pengajuanMasuk: pengajuanMasuk[0]?.total || 0,
        jadwalHariIni: jadwalHariIni[0]?.total || 0,
        riwayat: riwayat[0]?.total || 0,
        jumlahSiswa: jumlahSiswa[0]?.total || 0,
      },
      donut: donut[0] || { pending: 0, approved: 0, completed: 0 },
      monthly: monthlyConverted,
      aktivitas: aktivitas || []
    });

  } catch (err) {
    console.error("Dashboard API Error:", err);
    return Response.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
