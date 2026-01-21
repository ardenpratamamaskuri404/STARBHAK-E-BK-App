"use client";

import { useEffect, useState } from "react";
import NavbarSiswa from "@/components/NavbarSiswa";
import { Calendar, ClipboardList, Clock, PlusCircle, BookOpen } from "lucide-react";

export default function DashboardSiswa() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/siswa/dashboard");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-300 border-t-[#0046FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarSiswa />

      <div className="max-w-5xl mx-auto pt-28 px-6 pb-20">
        <h1 className="text-4xl font-extrabold text-[#0046FF] mb-10 text-center">
          Dashboard Siswa
        </h1>

        {/* STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<ClipboardList size={20} />}
            label="Total Pengajuan"
            value={data?.total ?? 0}
            valueColor="text-[#0046FF]"
          />

          <StatCard
            icon={<Calendar size={20} />}
            label="Konseling Selesai"
            value={data?.selesai ?? 0}
            valueColor="text-green-600"
          />

          <StatCard
            icon={<Clock size={20} />}
            label="Status Terbaru"
            value={data?.terbaru?.status?.toUpperCase() ?? "-"}
            valueColor="text-[#0046FF]"
            small
          />
        </div>

        {/* 🔵 AKSES CEPAT (tambah Catatan Pribadi) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <QuickAction
            icon={<BookOpen size={26} />}
            label="Catatan Pribadi"
            href="/siswa/catatan"
          />

          <QuickAction
            icon={<ClipboardList size={26} />}
            label="Riwayat Konseling"
            href="/siswa/riwayat"
          />

          <QuickAction
            icon={<PlusCircle size={26} />}
            label="Ajukan Konseling"
            href="/siswa/ajukan"
          />
        </div>

        {/* JADWAL MENDATANG */}
        <SectionCard title="Jadwal Konseling Mendatang">
          {!data?.upcoming ? (
            <p className="text-gray-600">Belum ada jadwal konseling mendatang.</p>
          ) : (
            <InfoList
              items={[
                {
                  label: "Tanggal",
                  value: new Date(data.upcoming.scheduled_datetime)
                    .toLocaleString("id-ID"),
                },
                { label: "Guru BK", value: data.upcoming.teacher_name },
                {
                  label: "Status",
                  value: data.upcoming.status.toUpperCase(),
                },
              ]}
            />
          )}
        </SectionCard>

        {/* STATUS PENGAJUAN TERBARU */}
        <SectionCard title="Status Pengajuan Terbaru">
          {!data?.terbaru ? (
            <p className="text-gray-600">Belum ada pengajuan konseling.</p>
          ) : (
            <InfoList
              items={[
                {
                  label: "Status",
                  value: data.terbaru.status.toUpperCase(),
                },
                data.terbaru.preferred_datetime && {
                  label: "Diajukan pada",
                  value: new Date(
                    data.terbaru.preferred_datetime
                  ).toLocaleString("id-ID"),
                },
                data.terbaru.teacher_name && {
                  label: "Guru BK",
                  value: data.terbaru.teacher_name,
                },
                data.terbaru.reason && {
                  label: "Alasan",
                  value: data.terbaru.reason,
                },
              ].filter(Boolean)}
            />
          )}
        </SectionCard>

        {/* CTA AJUKAN */}
        <div className="text-center mt-10">
          <a
            href="/siswa/ajukan"
            className="inline-flex items-center gap-2 bg-[#0046FF] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} />
            Ajukan Konseling
          </a>
        </div>
      </div>
    </div>
  );
}

/* --- COMPONENTS --- */

function StatCard({ icon, label, value, valueColor, small }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-200">
      <div className="text-gray-500 flex items-center gap-2 mb-2">
        {icon} {label}
      </div>
      <div
        className={`${small ? "text-2xl" : "text-4xl"} font-bold ${valueColor}`}
      >
        {value}
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-200 mb-8">
      <h2 className="text-xl font-bold text-[#0046FF] mb-3">{title}</h2>
      {children}
    </div>
  );
}

function InfoList({ items }) {
  return (
    <div className="space-y-1 text-gray-700">
      {items.map((it, i) => (
        <p key={i}>
          <span className="font-semibold">{it.label}:</span> {it.value}
        </p>
      ))}
    </div>
  );
}

/* ⭐ QUICK ACTION (baru) */
function QuickAction({ icon, label, href }) {
  return (
    <a
      href={href}
      className="bg-white p-6 rounded-3xl shadow-md border border-gray-200 flex flex-col items-center text-center hover:shadow-lg transition"
    >
      <div className="text-[#0046FF] mb-2">
        {icon}
      </div>
      <p className="font-semibold text-gray-800">{label}</p>
    </a>
  );
}
