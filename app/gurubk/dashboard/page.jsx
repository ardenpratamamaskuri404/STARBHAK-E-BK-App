"use client";

import { useEffect, useState } from "react";
import NavbarGuru from "@/components/NavbarGuru";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { Users, ClipboardList, Clock, CheckCircle, NotebookPen } from "lucide-react";

export default function DashboardGuru() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/guru/dashboard")
      .then((res) => res.json())
      .then((d) => setData(d || {}))
      .catch((err) => console.error("Fetch Error Dashboard:", err));
  }, []);

  if (!data) return <div className="p-10">Loading...</div>;

  const donut = data?.donut || { pending: 0, approved: 0, completed: 0 };
  const monthly = data?.monthly || [];

  const COLORS = ["#0046FF", "#6E8CFB", "#00C4B4"];

  const donutData = [
    { name: "Pending", value: donut.pending },
    { name: "Approved", value: donut.approved },
    { name: "Completed", value: donut.completed },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <NavbarGuru />

      <div className="p-8 pt-24">
        <h1 className="text-3xl font-bold text-[#0046FF]">Dashboard Guru</h1>
        <p className="text-gray-600 mt-1">Ringkasan data bimbingan konseling</p>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-10">
          <StatCard icon={<ClipboardList />} title="Pengajuan Masuk" value={data?.statistik?.pengajuanMasuk || 0} />
          <StatCard icon={<Clock />} title="Jadwal Hari Ini" value={data?.statistik?.jadwalHariIni || 0} />
          <StatCard icon={<CheckCircle />} title="Riwayat Selesai" value={data?.statistik?.riwayat || 0} />
          <StatCard icon={<Users />} title="Siswa Dibimbing" value={data?.statistik?.jumlahSiswa || 0} />

          {/* CARD CATATAN BARU */}
          <CatatanCard />
        </div>

        {/* GRAFIK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

          {/* Donut Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-[#0046FF] mb-4">Status Konseling</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" outerRadius={120} label>
                  {donutData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-[#0046FF] mb-4">Konseling per Bulan</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthly}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#0046FF" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Aktivitas */}
        <div className="bg-white p-6 rounded-2xl shadow-md mt-10">
          <h2 className="text-xl font-semibold text-[#0046FF] mb-4">Aktivitas Terbaru</h2>

          {(!data.aktivitas || data.aktivitas.length === 0) ? (
            <p className="text-gray-500">Belum ada aktivitas.</p>
          ) : (
            <div className="space-y-4">
              {data.aktivitas.map((a) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border rounded-xl p-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold text-[#0046FF]">{a.student_name}</p>
                    <p className="text-gray-600 text-sm">{a.title}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {a.completed_at ? new Date(a.completed_at).toLocaleDateString() : "-"}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white border rounded-2xl p-6 shadow-md flex items-center gap-4"
    >
      <div className="p-4 bg-[#0046FF]/10 text-[#0046FF] rounded-xl">{icon}</div>
      <div>
        <p className="text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-[#0046FF]">{value}</p>
      </div>
    </motion.div>
  );
}

function CatatanCard() {
  return (
    <motion.a
      href="/gurubk/catatan"
      whileHover={{ scale: 1.05 }}
      className="bg-[#0046FF] text-white border rounded-2xl p-6 shadow-md flex items-center gap-4 cursor-pointer"
    >
      <div className="p-4 bg-white/20 rounded-xl">
        <NotebookPen size={28} />
      </div>
      <div>
        <p className="text-white/80">Akses</p>
        <p className="text-2xl font-bold">Catatan Siswa</p>
      </div>
    </motion.a>
  );
}
