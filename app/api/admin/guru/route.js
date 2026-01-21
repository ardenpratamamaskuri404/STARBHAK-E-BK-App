import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import bcrypt from "bcryptjs";

// =========================
// GET — Semua Guru (dengan phone juga biar lengkap)
// =========================
export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.phone,
                gp.nip, gp.mata_pelajaran, gp.jabatan, gp.bio
            FROM users u
            LEFT JOIN guru_profile gp ON gp.user_id = u.id
            WHERE u.role = 'guru' AND u.is_active = 1
            ORDER BY u.name ASC
        `);

        return NextResponse.json({ data: rows }, { status: 200 });
    } catch (err) {
        console.error("GET guru ERROR:", err);
        return NextResponse.json({ error: "Gagal memuat data guru" }, { status: 500 });
    }
}

// =========================
// POST — Tambah Guru Baru
// =========================
export async function POST(req) {
    let connection;
    try {
        const body = await req.json();
        const { name, email, password, phone, nip, mata_pelajaran, jabatan, bio } = body;

        // Validasi wajib
        if (!name || !email || !password || !nip) {
            return NextResponse.json({ error: "Nama, Email, Password, dan NIP wajib diisi!" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Cek email sudah ada?
        const [emailCheck] = await connection.query("SELECT id FROM users WHERE email = ?", [email]);
        if (emailCheck.length > 0) {
            await connection.rollback();
            return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
        }

        // Cek NIP sudah dipakai?
        const [nipCheck] = await connection.query("SELECT user_id FROM guru_profile WHERE nip = ?", [nip]);
        if (nipCheck.length > 0) {
            await connection.rollback();
            return NextResponse.json({ error: "NIP sudah digunakan" }, { status: 400 });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Insert ke users
        const [userResult] = await connection.query(
            `INSERT INTO users (name, email, password, phone, role) 
             VALUES (?, ?, ?, ?, 'guru')`,
            [name, email, hashed, phone || null]
        );

        const user_id = userResult.insertId;

        // Insert ke guru_profile
        await connection.query(
            `INSERT INTO guru_profile 
             (user_id, nip, mata_pelajaran, jabatan, bio) 
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, nip, mata_pelajaran || null, jabatan || null, bio || null]
        );

        await connection.commit();

        return NextResponse.json({ 
            message: "Guru berhasil ditambahkan!", 
            id: user_id 
        }, { status: 201 });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("POST guru ERROR:", error);
        return NextResponse.json({ error: "Gagal menambahkan guru" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}