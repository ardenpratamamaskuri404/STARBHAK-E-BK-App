"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Plus, Edit, UserPlus, Calendar, MapPin, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function Page() {
    const [siswaList, setSiswaList] = useState([]);
    const [kelasList, setKelasList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterKelas, setFilterKelas] = useState("");
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "", // tambah phone biar konsisten
        password: "",
        nis: "",
        tanggal_lahir: "",
        alamat: "",
        kelas_id: "",
        emergency_contact: "",
    });

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [siswaRes, kelasRes] = await Promise.all([
                fetch("/api/admin/siswa"),
                fetch("/api/admin/kelas"),
            ]);

            if (!siswaRes.ok || !kelasRes.ok) throw new Error("Gagal memuat data");

            const siswaData = await siswaRes.json();
            const kelasData = await kelasRes.json();

            setSiswaList(siswaData.data || siswaData);
            setKelasList(kelasData);
        } catch (err) {
            toast.error("Gagal memuat data siswa/kelas");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.nis || !form.kelas_id) {
            toast.error("Nama, Email, NIS, dan Kelas wajib diisi!");
            return;
        }

        const method = editId ? "PUT" : "POST";
        const url = editId ? `/api/admin/siswa/${editId}` : "/api/admin/siswa";

        const bodyData = { ...form };
        if (!bodyData.password) delete bodyData.password; // jangan kirim password kosong

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json", // cegah <!DOCTYPE> error
                },
                body: JSON.stringify(bodyData),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || "Gagal menyimpan");

            toast.success(editId ? "Siswa berhasil diperbarui!" : "Siswa berhasil ditambahkan!");
            resetForm();
            loadData(); // refresh data tanpa reload
        } catch (err) {
            toast.error(err.message || "Terjadi kesalahan");
        }
    };

    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            phone: "",
            password: "",
            nis: "",
            tanggal_lahir: "",
            alamat: "",
            kelas_id: "",
            emergency_contact: "",
        });
        setEditId(null);
    };

    const handleEdit = (siswa) => {
        setEditId(siswa.id);
        setForm({
            name: siswa.name || "",
            email: siswa.email || "",
            phone: siswa.phone || "",
            password: "",
            nis: siswa.nis || "",
            tanggal_lahir: siswa.tanggal_lahir?.split("T")[0] || "",
            alamat: siswa.alamat || "",
            kelas_id: siswa.kelas_id || "",
            emergency_contact: siswa.emergency_contact || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus siswa ini? Data akan hilang permanen!")) return;

        try {
            const res = await fetch(`/api/admin/siswa/${id}`, {
                method: "DELETE",
                headers: { Accept: "application/json" },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Gagal menghapus");
            }

            toast.success("Siswa berhasil dihapus!");
            setSiswaList((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            toast.error(err.message || "Gagal menghapus siswa");
        }
    };

    const filteredSiswa = useMemo(() => {
        const search = searchTerm.toLowerCase();
        return siswaList.filter((item) => {
            const matchSearch =
                item.name?.toLowerCase().includes(search) ||
                item.nis?.includes(search) ||
                item.email?.toLowerCase().includes(search);
            const matchKelas = !filterKelas || item.kelas_id == filterKelas;
            return matchSearch && matchKelas;
        });
    }, [siswaList, searchTerm, filterKelas]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-4xl font-bold text-[#0046FF]">
                Loading Data Siswa...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-6">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-10">
                    <h1 className="text-5xl font-extrabold text-[#0046FF] flex items-center gap-4">
                        <UserPlus size={48} /> Kelola Data Siswa
                    </h1>
                    <p className="text-xl text-gray-600 mt-3">
                        Tambah, Edit, dan Kelola Seluruh Data Siswa Sekolah
                    </p>
                </div>

                {/* FORM */}
                <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12 border border-gray-200">
                    <h2 className="text-3xl font-bold text-[#0046FF] mb-8 flex items-center gap-3">
                        <Plus size={36} /> {editId ? "Edit Siswa" : "Tambah Siswa Baru"}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <input required placeholder="Nama Lengkap" className="text-gray-800 px-5 py-4 border-2 rounded-2xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <input required type="email" placeholder="Email Siswa" className="px-5 py-4 border-2 rounded-2xl text-gray-800" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        <input placeholder="No. Telepon" className="text-gray-800 px-5 py-4 border-2 rounded-2xl" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

                        <input required placeholder="NIS / NISN" className="text-gray-800 px-5 py-4 border-2 rounded-2xl" value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} />

                        <div className="text-gray-800 flex items-center gap-3 px-5 py-4 border-2 rounded-2xl">
                            <Calendar className="text-gray-800" />
                            <input type="date" className="flex-1 focus:outline-none text-gray-800" value={form.tanggal_lahir} onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })} />
                        </div>

                        <select required className="text-gray-800 px-5 py-4 border-2 rounded-2xl bg-white" value={form.kelas_id} onChange={(e) => setForm({ ...form, kelas_id: e.target.value })}>
                            <option value="">-- Pilih Kelas --</option>
                            {kelasList.map((k) => (
                                <option key={k.id} value={k.id}>
                                    {k.nama}
                                </option>
                            ))}
                        </select>

                        {editId === null ? (
                            <input required type="password" placeholder="Password Akun Siswa" className="text-gray-800 px-5 py-4 border-2 rounded-2xl" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        ) : (
                            <input type="password" placeholder="Kosongkan jika tidak ganti password" className="text-gray-800 px-5 py-4 border-2 rounded-2xl" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        )}

                        <div className="text-gray-800 md:col-span-2 lg:col-span-3 flex items-center gap-3 px-5 py-4 border-2 rounded-2xl">
                            <MapPin className="text-gray-500" />
                            <input placeholder="Alamat Lengkap" className="flex-1 focus:outline-none" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
                        </div>

                        <div className="text-gray-800 md:col-span-2 lg:col-span-3 flex items-center gap-3 px-5 py-4 border-2 rounded-2xl">
                            <Phone className="text-gray-500" />
                            <input placeholder="No. HP Orang Tua / Wali" className="flex-1 focus:outline-none" value={form.emergency_contact} onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })} />
                        </div>

                        <div className="md:col-span-3 flex gap-4">
                            <button type="submit" className="flex-1 bg-[#0046FF] hover:bg-[#0037CC] text-white font-bold py-5 rounded-2xl transition">
                                {editId ? "Update" : "Tambah"} Siswa
                            </button>
                            {editId && (
                                <button type="button" onClick={resetForm} className="px-10 bg-gray-400 hover:bg-gray-500 text-white font-bold py-5 rounded-2xl transition">
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* TABEL */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0046FF] to-[#0037CC] p-6 text-white">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                            <h2 className="text-3xl font-bold">Daftar Siswa ({filteredSiswa.length})</h2>
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

                                {/* SEARCH BAR MODERN */}
                                <div className="relative w-full sm:w-80">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

                                    <input
                                        type="text"
                                        placeholder="Cari nama, NIS, email..."
                                        className="
                w-full
                pl-14 pr-5 py-4
                bg-white
                text-black
                rounded-2xl
                border border-white
                shadow-md
                focus:ring-4 focus:ring-blue-200
                focus:border-white
                focus:outline-none
                placeholder-gray-500
                transition-all
            "
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* FILTER DROPDOWN MODERN */}
                                <select
                                    className="
            w-full sm:w-auto
            px-5 py-4
            bg-white
            text-black
            rounded-2xl
            border border-white
            shadow-md
            focus:ring-4 focus:ring-blue-200
            focus:outline-none
            transition-all
        "
                                    value={filterKelas}
                                    onChange={(e) => setFilterKelas(e.target.value)}
                                >
                                    <option value="">Semua Kelas</option>
                                    {kelasList.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.nama}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 text-gray-700 font-semibold">
                                <tr>
                                    <th className="px-8 py-5 text-left">No</th>
                                    <th className="px-8 py-5 text-left">Nama</th>
                                    <th className="px-8 py-5 text-left">NIS</th>
                                    <th className="px-8 py-5 text-left">Email</th>
                                    <th className="px-8 py-5 text-left">Kelas</th>
                                    <th className="px-8 py-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSiswa.map((s, i) => (
                                    <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="text-gray-800 px-8 py-6">{i + 1}</td>
                                        <td className="text-gray-800 px-8 py-6 font-bold">{s.name}</td>
                                        <td className="px-8 py-6 text-blue-600 font-mono">{s.nis}</td>
                                        <td className="text-gray-800 px-8 py-6">{s.email}</td>
                                        <td className="text-gray-800 px-8 py-6">{s.nama_kelas || "-"}</td>
                                        <td className="text-gray-800 px-8 py-6 text-center">
                                            <button onClick={() => handleEdit(s)} className="px-7 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold mr-3 transition">
                                                <Edit size={18} className="inline mr-1" /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(s.id)} className="px-7 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition">
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredSiswa.length === 0 && (
                            <div className="text-center py-20 text-gray-500 text-xl">
                                Belum ada data siswa {filterKelas && "di kelas ini"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}