"use client";

import { useEffect, useState, useMemo } from "react"; // ← tambah useMemo
import axios from "axios";
import NavbarAdmin from "@/components/NavbarAdmin";
import { Users, UserCheck, ClipboardList, Search } from "lucide-react";

export default function DashboardAdmin() {
    const [students, setStudents] = useState(0);
    const [teachers, setTeachers] = useState(0);
    const [allBorrowings, setAllBorrowings] = useState([]); // ← data mentah dari API

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDateStart, setFilterDateStart] = useState("");
    const [filterDateEnd, setFilterDateEnd] = useState("");

    // Load data sekali aja
    useEffect(() => {
        async function load() {
            try {
                const [s, g, b] = await Promise.all([
                    axios.get("/api/admin/list-students"),
                    axios.get("/api/admin/list-teachers"),
                    axios.get("/api/admin/list-borrowings")
                ]);

                setStudents(s.data.length);
                setTeachers(g.data.length);
                setAllBorrowings(b.data); // ← simpan data asli di sini
            } catch (error) {
                console.error("Error loading dashboard:", error);
            }
        }
        load();
    }, []);

    // PAKAI useMemo → ini paling aman, cepat, dan ga bikin error!
    const borrowings = useMemo(() => {
        if (allBorrowings.length === 0) return [];

        return allBorrowings.filter(item => {
            // Search
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                if (!item.kode?.toLowerCase().includes(search) &&
                    !item.siswa_id?.toLowerCase().includes(search)) {
                    return false;
                }
            }

            // Status
            if (filterStatus && item.status !== filterStatus) {
                return false;
            }

            // Date range
            const itemDate = new Date(item.created_at);
            if (filterDateStart && itemDate < new Date(filterDateStart)) {
                return false;
            }
            if (filterDateEnd) {
                const endDate = new Date(filterDateEnd);
                endDate.setHours(23, 59, 59, 999);
                if (itemDate > endDate) return false;
            }

            return true;
        });
    }, [allBorrowings, searchTerm, filterStatus, filterDateStart, filterDateEnd]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("id-ID", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "approved": return "bg-emerald-100 text-emerald-800 border border-emerald-300";
            case "pending": return "bg-amber-100 text-amber-800 border border-amber-300";
            case "rejected": return "bg-rose-100 text-rose-800 border border-rose-300";
            case "completed": return "bg-indigo-100 text-indigo-800 border border-indigo-300";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    // ... sisanya UI kamu tetep sama, cuma ganti borrowings.length jadi borrowings.length
    return (
        <>
            <NavbarAdmin />

            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-5xl font-extrabold text-[#0046FF] tracking-tight">
                            Dashboard Admin
                        </h1>
                        <p className="text-xl text-gray-600 mt-3">
                            SELAMAT DATANG DI DASHBOARD ADMIN
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {[
                            { icon: Users, label: "Total Siswa", value: students, gradient: "from-blue-500 to-cyan-500" },
                            { icon: UserCheck, label: "Total Guru BK", value: teachers, gradient: "from-purple-500 to-pink-500" },
                            { icon: ClipboardList, label: "Riwayat Transaksi", value: allBorrowings.length, gradient: "from-green-500 to-emerald-500" },
                        ].map((stat, i) => (
                            <div key={i} className="group bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 font-semibold text-lg">{stat.label}</p>
                                        <p className="text-5xl font-extrabold text-gray-800 mt-3">{stat.value}</p>
                                    </div>
                                    <div className={`p-5 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon size={48} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tabel Riwayat */}
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#0046FF] to-blue-700 px-8 py-7 text-white">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                                <div>
                                    <h2 className="text-3xl font-bold flex items-center gap-3">
                                        <ClipboardList size={36} />
                                        Riwayat Konseling
                                    </h2>
                                    <p className="text-blue-100 mt-1">
                                        Total: {borrowings.length} dari {allBorrowings.length} Riwayat Transaksi
                                    </p>
                                </div>

                               {/* Search & Filter */}
<div className="flex flex-wrap items-center gap-4">

    {/* Search Bar */}
    <div className="relative">
        <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
            size={20} 
        />
        <input
            type="text"
            placeholder="Cari kode / nama siswa..."
            className="pl-12 pr-5 py-3 w-72 rounded-xl bg-white text-black shadow-lg outline-none focus:ring-4 focus:ring-blue-300 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    </div>

    {/* Filter Status */}
    <select
        className="px-5 py-3 rounded-xl bg-white text-black font-medium shadow-lg outline-none focus:ring-4 focus:ring-blue-300 transition"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
    >
        <option value="">Semua Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="completed">Completed</option>
    </select>

    {/* Filter Tanggal */}
    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-lg">
        <input
            type="date"
            className="bg-transparent text-black outline-none"
            value={filterDateStart}
            onChange={(e) => setFilterDateStart(e.target.value)}
        />
        <span className="text-gray-500">→</span>
        <input
            type="date"
            className="bg-transparent text-black outline-none"
            value={filterDateEnd}
            onChange={(e) => setFilterDateEnd(e.target.value)}
        />
    </div>

    {/* Tombol Reset */}
    {(searchTerm || filterStatus || filterDateStart || filterDateEnd) && (
        <button
            onClick={() => {
                setSearchTerm("");
                setFilterStatus("");
                setFilterDateStart("");
                setFilterDateEnd("");
            }}
            className="px-5 py-3 bg-white/30 hover:bg-white/40 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/40 transition shadow-lg"
        >
            Reset
        </button>
    )}
</div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-gray-700 text-left text-sm uppercase tracking-wider border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-8 py-5 font-bold">Kode</th>
                                        <th className="px-8 py-5 font-bold">Siswa</th>
                                        <th className="px-8 py-5 font-bold">Guru</th>
                                        <th className="px-8 py-5 font-bold">Keperluan</th>
                                        <th className="px-8 py-5 font-bold">Tanggal</th>
                                        <th className="px-8 py-5 font-bold text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {borrowings.length > 0 ? (
                                        borrowings.map((item) => (
                                            <tr key={item.id} className="hover:bg-blue-50/50 transition-all duration-200">
                                                <td className="px-8 py-6 font-mono font-bold text-[#0046FF] text-lg">{item.kode}</td>
                                                <td className="px-8 py-6 font-medium">{item.siswa_id || "-"}</td>
                                                <td className="px-8 py-6">{item.guru_id || "-"}</td>
                                                <td className="px-8 py-6 max-w-xs truncate">{item.purpose || "-"}</td>
                                                <td className="px-8 py-6 text-gray-600 font-medium">{formatDate(item.created_at)}</td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusStyle(item.status)}`}>
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-20 text-gray-500 text-lg font-medium">
                                                {allBorrowings.length === 0 ? "Memuat data..." : "Tidak ada data yang sesuai filter."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}