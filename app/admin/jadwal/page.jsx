// app/admin/jadwal/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Calendar, Clock, User, CheckCircle, XCircle, Edit, Filter } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function JadwalKonseling() {
    const [jadwal, setJadwal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // Load jadwal
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const res = await fetch("/api/admin/jadwal");
                const data = await res.json();
                setJadwal(data);
            } catch (err) {
                toast.error("Gagal memuat jadwal konseling");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Approve / Reject
    const handleStatus = async (id, status) => {
        const res = await fetch(`/api/admin/jadwal/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });

        if (res.ok) {
            toast.success(status === "scheduled" ? "Jadwal disetujui!" : "Jadwal ditolak!");
            setJadwal(prev => prev.map(j => j.id === id ? { ...j, status } : j));
        } else {
            toast.error("Gagal update status");
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "scheduled": return "bg-emerald-100 text-emerald-800 border-emerald-300";
            case "done": return "bg-blue-100 text-blue-800 border-blue-300";
            case "missed": return "bg-gray-100 text-gray-800 border-gray-300";
            case "cancelled": return "bg-rose-100 text-rose-800 border-rose-300";
            default: return "bg-amber-100 text-amber-800 border-amber-300";
        }
    };

    const filteredJadwal = useMemo(() => {
        return jadwal.filter(j => {
            const search = searchTerm.toLowerCase();
            return (
                j.siswa_name.toLowerCase().includes(search) ||
                j.guru_name.toLowerCase().includes(search) ||
                j.lokasi?.toLowerCase().includes(search)
            ) && (!filterStatus || j.status === filterStatus);
        });
    }, [jadwal, searchTerm, filterStatus]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-3xl font-bold text-[#0046FF]">Memuat Jadwal Konseling...</div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gray-50 py-8 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-5xl font-extrabold text-[#0046FF] flex items-center gap-4">
                            <Calendar size={48} /> Jadwal Konseling
                        </h1>
                        <p className="text-xl text-gray-600 mt-3">Kelola dan approve jadwal konseling siswa dengan guru BK</p>
                    </div>

                    {/* Filter */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari siswa / guru / lokasi..."
                                    className="pl-12 pr-5 py-4 w-full rounded-xl border focus:ring-2 focus:ring-[#0046FF]"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-6 py-4 rounded-xl border focus:ring-2 focus:ring-[#0046FF]"
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                <option value="scheduled">Disetujui</option>
                                <option value="pending">Menunggu</option>
                                <option value="done">Selesai</option>
                                <option value="missed">Tidak Hadir</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                        </div>
                    </div>

                    {/* Tabel Jadwal */}
                    <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">
                        <div className="bg-gradient-to-r from-[#0046FF] to-blue-700 p-6 text-white">
                            <h2 className="text-3xl font-bold">Daftar Jadwal Konseling ({filteredJadwal.length})</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-gray-700 text-left text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">No</th>
                                        <th className="px-6 py-4 font-bold">Siswa</th>
                                        <th className="px-6 py-4 font-bold">Guru BK</th>
                                        <th className="px-6 py-4 font-bold">Waktu</th>
                                        <th className="px-6 py-4 font-bold">Durasi</th>
                                        <th className="px-6 py-4 font-bold">Lokasi</th>
                                        <th className="px-6 py-4 font-bold text-center">Status</th>
                                        <th className="px-6 py-4 font-bold text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredJadwal.map((j, i) => (
                                        <tr key={j.id} className="hover:bg-blue-50 transition">
                                            <td className="px-6 py-4">{i + 1}</td>
                                            <td className="px-6 py-4 font-medium flex items-center gap-2">
                                                <User size={18} /> {j.siswa_name}
                                            </td>
                                            <td className="px-6 py-4">{j.guru_name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    {formatDate(j.scheduled_datetime)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                                                    {j.duration_minutes} menit
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{j.lokasi || "Ruang BK"}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusStyle(j.status)}`}>
                                                    {j.status === "scheduled" ? "Disetujui" :
                                                     j.status === "pending" ? "Menunggu" :
                                                     j.status === "done" ? "Selesai" :
                                                     j.status === "missed" ? "Tidak Hadir" : "Dibatalkan"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {j.status === "pending" && (
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleStatus(j.id, "scheduled")}
                                                            className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition shadow"
                                                            title="Setujui"
                                                        >
                                                            <CheckCircle size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatus(j.id, "cancelled")}
                                                            className="p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition shadow"
                                                            title="Tolak"
                                                        >
                                                            <XCircle size={20} />
                                                        </button>
                                                    </div>
                                                )}
                                                {j.status !== "pending" && (
                                                    <span className="text-gray-500 text-sm">Sudah diproses</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredJadwal.length === 0 && (
                                <div className="text-center py-20 text-gray-500 text-xl">
                                    Belum ada jadwal konseling {filterStatus && "dengan status ini"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}