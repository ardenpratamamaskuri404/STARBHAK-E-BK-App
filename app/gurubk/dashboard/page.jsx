"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Users, ClipboardList, Clock, CheckCircle2, XCircle, Activity, NotebookPen, AlertCircle, TrendingUp } from "lucide-react";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

export default function DashboardGuru() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/guru/dashboard")
      .then((res) => res.json())
      .then((d) => { setData(d || {}); setLoading(false); })
      .catch((err) => { console.error("Fetch Error Dashboard:", err); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-500">Memuat dashboard...</div>
      </div>
    );
  }

  const donut = data?.donut || { pending: 0, approved: 0, completed: 0, rejected: 0 };
  const monthly = data?.monthly || [];
  const stats = data?.statistik || {};
  const aktivitas = data?.aktivitas || [];
  const pendingList = data?.pendingList || [];

  const donutData = [
    { name: "Pending", value: donut.pending || 0 },
    { name: "Approved", value: donut.approved || 0 },
    { name: "Completed", value: donut.completed || 0 },
    { name: "Rejected", value: donut.rejected || 0 },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "pending": return <Clock className="w-4 h-4 text-amber-500" />;
      case "rejected": return <XCircle className="w-4 h-4 text-rose-500" />;
      case "completed": return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      rejected: "bg-rose-100 text-rose-700 border-rose-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900">Dashboard Monitoring</h1>
          <p className="text-gray-500 mt-2">Ringkasan data bimbingan konseling Anda</p>
        </motion.div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={<ClipboardList className="w-6 h-6" />} title="Pengajuan Masuk" value={stats.pengajuanMasuk || 0} color="amber" />
          <StatCard icon={<Clock className="w-6 h-6" />} title="Jadwal Hari Ini" value={stats.jadwalHariIni || 0} color="blue" />
          <StatCard icon={<CheckCircle2 className="w-6 h-6" />} title="Selesai" value={stats.riwayat || 0} color="emerald" />
          <StatCard icon={<Users className="w-6 h-6" />} title="Siswa Dibimbing" value={stats.jumlahSiswa || 0} color="purple" />
          <motion.a
            href="/gurubk/catatan"
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-4 shadow-lg flex items-center gap-3 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="p-2 bg-white/20 rounded-lg">
              <NotebookPen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-xs">Akses</p>
              <p className="font-bold text-sm">Catatan</p>
            </div>
          </motion.a>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatusBadge label="Pending" value={donut.pending || 0} color="amber" icon={<Clock className="w-5 h-5" />} />
          <StatusBadge label="Approved" value={donut.approved || 0} color="emerald" icon={<CheckCircle2 className="w-5 h-5" />} />
          <StatusBadge label="Completed" value={donut.completed || 0} color="blue" icon={<Activity className="w-5 h-5" />} />
          <StatusBadge label="Rejected" value={donut.rejected || 0} color="rose" icon={<XCircle className="w-5 h-5" />} />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Donut Chart */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Distribusi Status</CardTitle>
            </CardHeader>
            <CardContent>
              {donutData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={donutData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} paddingAngle={5} label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""}>
                      {donutData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">Belum ada data</div>
              )}
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Konseling per Bulan</CardTitle>
            </CardHeader>
            <CardContent>
              {monthly.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">Belum ada data</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending List */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Menunggu Persetujuan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingList.length > 0 ? (
                <div className="space-y-3">
                  {pendingList.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{item.student_name}</p>
                          <p className="text-xs text-gray-500">{item.title || "Pengajuan Konseling"}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(item.requested_at).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">Tidak ada pengajuan pending</div>
              )}
            </CardContent>
          </Card>

          {/* Aktivitas */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aktivitas.length > 0 ? (
                <div className="space-y-3">
                  {aktivitas.map((a) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(a.status)}
                        <div>
                          <p className="font-medium text-sm text-gray-900">{a.student_name}</p>
                          <p className="text-xs text-gray-500">{a.title || "Pengajuan"}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(a.status)}`}>
                        {a.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">Belum ada aktivitas</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colors = {
    amber: "from-amber-500 to-amber-600",
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-lg border-0 flex items-center gap-3">
      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${colors[color]} text-white shadow-md`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}

function StatusBadge({ label, value, color, icon }) {
  const colors = {
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    rose: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]} flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

