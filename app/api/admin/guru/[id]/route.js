// app/api/admin/guru/[id]/route.js → KALO MAU PAKE YANG INI, GANTI FRONTEND JADI KE SINI

import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import bcrypt from "bcryptjs";

let connection;

export async function PUT(req, { params }) {
    const { id } = await params; // JANGAN LUPA INI DI APP ROUTER!

    try {
        const body = await req.json();
        const { name, email, phone, password, nip, mata_pelajaran, jabatan, bio } = body;

        if (!id || !name || !email || !nip) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Cek email duplikat (kecuali diri sendiri)
        const [emailCheck] = await connection.query(
            "SELECT id FROM users WHERE email = ? AND id != ?", [email, id]
        );
        if (emailCheck.length > 0) {
            await connection.rollback();
            return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
        }

        // Cek NIP duplikat
        const [nipCheck] = await connection.query(
            "SELECT user_id FROM guru_profile WHERE nip = ? AND user_id != ?", [nip, id]
        );
        if (nipCheck.length > 0) {
            await connection.rollback();
            return NextResponse.json({ error: "NIP sudah digunakan" }, { status: 400 });
        }

        // Update users
        if (password && password.trim() !== "") {
            const hashed = await bcrypt.hash(password, 10);
            await connection.query(
                "UPDATE users SET name = ?, email = ?, phone = ?, password = ? WHERE id = ?",
                [name, email, phone || null, hashed, id]
            );
        } else {
            await connection.query(
                "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
                [name, email, phone || null, id]
            );
        }

        // Update atau Insert guru_profile
        const [profile] = await connection.query("SELECT user_id FROM guru_profile WHERE user_id = ?", [id]);
        if (profile.length === 0) {
            await connection.query(
                "INSERT INTO guru_profile (user_id, nip, mata_pelajaran, jabatan, bio) VALUES (?, ?, ?, ?, ?)",
                [id, nip, mata_pelajaran || null, jabatan || null, bio || null]
            );
        } else {
            await connection.query(
                "UPDATE guru_profile SET nip = ?, mata_pelajaran = ?, jabatan = ?, bio = ? WHERE user_id = ?",
                [nip, mata_pelajaran || null, jabatan || null, bio || null, id]
            );
        }

        await connection.commit();
        return NextResponse.json({ message: "Guru berhasil diperbarui!" }, { status: 200 });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error("UPDATE GURU ERROR:", err);
        return NextResponse.json({ error: "Gagal update guru" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;

    try {
        if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

        // Hapus user → profile otomatis ikut kehapus karena ON DELETE CASCADE
        const [result] = await pool.query("DELETE FROM users WHERE id = ? AND role = 'guru'", [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "Guru berhasil dihapus!" }, { status: 200 });

    } catch (err) {
        console.error("DELETE GURU ERROR:", err);
        return NextResponse.json({ error: "Gagal menghapus guru" }, { status: 500 });
    }
}