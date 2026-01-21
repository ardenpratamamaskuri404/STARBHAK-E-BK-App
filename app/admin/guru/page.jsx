"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Plus, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function DataGuru() {
    const [guruList, setGuruList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        nip: "",
        mata_pelajaran: "",
        jabatan: "",
        bio: "",
    });

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadGuru();
    }, []);

    const loadGuru = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/guru");
            const json = await res.json();
            setGuruList(json.data || json);
        } catch (err) {
            toast.error("Gagal memuat data guru");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.nip) {
            toast.error("Nama, Email, dan NIP wajib diisi!");
            return;
        }

        const method = editId ? "PUT" : "POST";
        // SESUAIKAN DENGAN YANG SUDAH ADA: /api/admin/guru/[id]
        const url = editId ? `/api/admin/guru/${editId}` : "/api/admin/guru";

        const bodyData = {
            name: form.name,
            email: form.email,
            phone: form.phone || null,
            nip: form.nip,
            mata_pelajaran: form.mata_pelajaran || null,
            jabatan: form.jabatan || null,
            bio: form.bio || null,
        };

        // Password hanya dikirim jika diisi
        if (form.password && form.password.trim() !== "") {
            bodyData.password = form.password;
        }

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    // Tambahan biar ga kena redirect HTML login
                    Accept: "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Gagal menyimpan data");
            }

            toast.success(editId ? "Guru berhasil diperbarui!" : "Guru baru berhasil ditambahkan!");
            resetForm();
            loadGuru();
        } catch (err) {
            toast.error(err.message || "Terjadi kesalahan");
        }
    };

    const resetForm = () => {
        setForm({
            name: "", email: "", phone: "", password: "",
            nip: "", mata_pelajaran: "", jabatan: "", bio: ""
        });
        setEditId(null);
    };

    const handleEdit = (g) => {
        setEditId(g.id);
        setForm({
            name: g.name || "",
            email: g.email || "",
            phone: g.phone || "",
            password: "",
            nip: g.nip || "",
            mata_pelajaran: g.mata_pelajaran || "",
            jabatan: g.jabatan || "",
            bio: g.bio || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus guru ini? Data akan hilang permanen!")) return;

        try {
            const res = await fetch(`/api/admin/guru/${id}`, {
                method: "DELETE",
                headers: { Accept: "application/json" },
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || "Gagal menghapus");

            toast.success("Guru berhasil dihapus");
            setGuruList((prev) => prev.filter((g) => g.id !== id));
        } catch (err) {
            toast.error(err.message || "Gagal menghapus guru");
        }
    };

    const filteredGuru = useMemo(() => {
        const s = searchTerm.toLowerCase();
        return guruList.filter(
            (g) =>
                g.name?.toLowerCase().includes(s) ||
                g.email?.toLowerCase().includes(s) ||
                g.nip?.toLowerCase().includes(s) ||
                g.mata_pelajaran?.toLowerCase().includes(s)
        );
    }, [guruList, searchTerm]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-3xl font-bold text-blue-600">
                Loading Guru...
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-6">
            <div className="max-w-7xl mx-auto">
                {/* JUDUL */}
                <div className="mb-10">
                    <h1 className="text-5xl font-extrabold text-blue-600 flex items-center gap-4">
                        <UserPlus size={48} /> Kelola Guru BK
                    </h1>
                </div>

                {/* FORM */}
                <div className="bg-white p-10 rounded-3xl shadow-xl mb-12">
                    <h2 className="text-3xl font-bold text-blue-600 mb-8 flex items-center gap-3">
                        <Plus size={36} /> {editId ? "Edit Guru" : "Tambah Guru Baru"}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <input required placeholder="Nama Lengkap" className="text-gray-800 px-5 py-4 border rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <input required type="email" placeholder="Email" className="text-gray-800 px-5 py-4 border rounded-xl" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        <input placeholder="No. Telepon" className="text-gray-800 px-5 py-4 border rounded-xl" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

                        <input required placeholder="NIP" className="text-gray-800 px-5 py-4 border rounded-xl" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} />
                        <input placeholder="Mata Pelajaran" className="text-gray-800 px-5 py-4 border rounded-xl" value={form.mata_pelajaran} onChange={(e) => setForm({ ...form, mata_pelajaran: e.target.value })} />
                        <input placeholder="Jabatan" className="text-gray-800 px-5 py-4 border rounded-xl" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} />

                        {editId === null ? (
                            <input required type="password" placeholder="Password (wajib untuk akun baru)" className="text-gray-800 px-5 py-4 border rounded-xl" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        ) : (
                            <input type="password" placeholder="Kosongkan jika tidak ganti password" className="text-gray-800 px-5 py-4 border rounded-xl" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        )}

                        <textarea rows={4} placeholder="Bio / Catatan" className="text-gray-800 md:col-span-3 w-full px-5 py-4 border rounded-xl" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />

                        <div className="md:col-span-3 flex gap-4">
                            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-xl font-bold text-lg transition">
                                {editId ? "Update Guru" : "Tambah Guru"}
                            </button>
                            {editId && (
                                <button type="button" onClick={resetForm} className="px-10 bg-gray-400 hover:bg-gray-500 text-white py-5 rounded-xl font-bold transition">
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* TABEL */}
<div className="bg-white rounded-3xl shadow-xl overflow-hidden">
    <div className="bg-gradient-to-r from-[#0046FF] to-[#0037CC] p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4">
        
        <h2 className="text-2xl font-bold">
            Daftar Guru BK ({filteredGuru.length})
        </h2>

        {/* SEARCH BAR MODERN */}
        <div className="relative w-full md:w-80">
            <Search 
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"
                size={20}
            />

            <input
                type="text"
                placeholder="Cari guru..."
                className="
                    w-full
                    pl-14 pr-5 py-3.5
                    bg-white
                    text-black
                    rounded-2xl
                    border border-white
                    shadow-md
                    placeholder-gray-500
                    focus:outline-none
                    focus:ring-4 focus:ring-blue-200
                    transition-all
                "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 font-semibold text-gray-800">
                                <tr>
                                    <th className="px-6 py-4">No</th>
                                    <th className="px-6 py-4">Nama</th>
                                    <th className="px-6 py-4">NIP</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Mapel</th>
                                    <th className="px-6 py-4">Jabatan</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGuru.map((g, i) => (
                                    <tr key={g.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="text-gray-800 px-6 py-4">{i + 1}</td>
                                        <td className="text-gray-800 px-6 py-4 font-semibold">{g.name}</td>
                                        <td className="px-6 py-4 text-blue-600 font-mono">{g.nip || "-"}</td>
                                        <td className="text-gray-800 px-6 py-4">{g.email}</td>
                                        <td className="text-gray-800 px-6 py-4">{g.mata_pelajaran || "-"}</td>
                                        <td className="text-gray-800 px-6 py-4">{g.jabatan || "-"}</td>
                                        <td className="text-gray-800 px-6 py-4 text-center">
                                            <div className="flex gap-3 justify-center">
                                                <button onClick={() => handleEdit(g)} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(g.id)} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition">
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}