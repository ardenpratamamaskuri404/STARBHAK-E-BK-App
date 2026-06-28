"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, ClipboardList, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function DashboardAdmin() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await axios.get("/api/admin/dashboard");
                setData(res.data);
            } catch (error) {
                console.error("Error loading dashboard:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="animate-pulse text-xl text-gray-500">Memuat dashboard...</div>
            </div>
        );
    }

    const stats = data?.stats || {};
    const monthly = data?.monthly || [];
    const recent = data?.recent || [];
    const topStudents = data?.topStudents || [];

    const pieData = [
        { name: "Pending", value: stats.pending || 0 },
        { name: "Approved", value: stats.approved || 0 },
        { name: "Completed", value: stats.completed || 0 },
        { name: "Rejected", value: stats.rejected || 0 },
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-8">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-4xl font-bold text-gray-900">Dashboard Monitoring</h1>
                        <p className="text-gray-500 mt-2">Overview sistem bimbingan konseling</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={<Users className="w-6 h-6" />}
                            label="Total Siswa"
                            value={stats.totalStudents}
                            color="blue"
                            delay="0ms"
                        />
                        <StatCard
                            icon={<UserCheck className="w-6 h-6" />}
                            label="Total Guru BK"
                            value={stats.totalTeachers}
                            color="purple"
                            delay="100ms"
                        />
                        <StatCard
                            icon={<ClipboardList className="w-6 h-6" />}
                            label="Total Pengajuan"
                            value={stats.totalBorrowings}
                            color="green"
                            delay="200ms"
                        />
                        <StatCard
                            icon={<TrendingUp className="w-6 h-6" />}
                            label="Pengajuan Hari Ini"
                            value={stats.todayBorrowings}
                            color="orange"
                            delay="300ms"
                        />
                    </div>

                    {/* Status Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatusBadge label="Pending" value={stats.pending} color="amber" icon={<Clock className="w-5 h-5" />} />
                        <StatusBadge label="Approved" value={stats.approved} color="emerald" icon={<CheckCircle2 className="w-5 h-5" />} />
                        <StatusBadge label="Completed" value={stats.completed} color="blue" icon={<Activity className="w-5 h-5" />} />
                        <StatusBadge label="Rejected" value={stats.rejected} color="rose" icon={<XCircle className="w-5 h-5" />} />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Bar Chart */}
                        <Card className="lg:col-span-2 shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Statistik Bulanan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {monthly.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={monthly}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                                            <YAxis stroke="#6b7280" fontSize={12} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                                            />
                                            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[250px] flex items-center justify-center text-gray-400">
                                        Belum ada data
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pie Chart */}
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Distribusi Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pieData.some(d => d.value > 0) ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[250px] flex items-center justify-center text-gray-400">
                                        Belum ada data
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-3 justify-center mt-2">
                                    {pieData.map((entry, i) => (
                                        <div key={entry.name} className="flex items-center gap-2 text-sm">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                            <span className="text-gray-600">{entry.name}: {entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity & Top Students */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-500" />
                                    Aktivitas Terbaru
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recent.length > 0 ? (
                                    <div className="space-y-3">
                                        {recent.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(item.status)}
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-900">{item.siswa_name}</p>
                                                        <p className="text-xs text-gray-500">{item.title || "Pengajuan Konseling"}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400">Belum ada aktivitas</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Top Students */}
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                                    Siswa Paling Aktif
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {topStudents.length > 0 ? (
                                    <div className="space-y-3">
                                        {topStudents.map((student, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-900">{student.name}</p>
                                                        <p className="text-xs text-gray-500">NIS: {student.nis || "-"}</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                                    {student.total} pengajuan
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400">Belum ada data</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
        </div>
    );
}

function StatCard({ icon, label, value, color, delay }) {
    const colors = {
        blue: "from-blue-500 to-blue-600",
        purple: "from-purple-500 to-purple-600",
        green: "from-emerald-500 to-emerald-600",
        orange: "from-orange-500 to-orange-600",
    };
    const bgColors = {
        blue: "bg-blue-50",
        purple: "bg-purple-50",
        green: "bg-emerald-50",
        orange: "bg-orange-50",
    };
    const textColors = {
        blue: "text-blue-600",
        purple: "text-purple-600",
        green: "text-emerald-600",
        orange: "text-orange-600",
    };

    return (
        <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: delay }}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
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
