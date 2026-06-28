"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Calendar, Clock, BookOpen, FilePlus, History, ChevronRight } from "lucide-react";

export default function GuruHome() {
  const [data, setData] = useState({
    profile: { name: "" },
    pengajuanMasuk: 0,
    jadwalHariIni: [],
    riwayat: []
  });

  useEffect(() => {
    fetch("/api/guru/home")
      .then((res) => res.json())
      .then((d) =>
        setData({
          profile: d.profile ?? { name: "" },
          pengajuanMasuk: d.pengajuanMasuk ?? 0,
          jadwalHariIni: d.jadwalHariIni ?? [],
          riwayat: d.riwayat ?? []
        })
      )
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <div className="p-8">

        {/* Sambutan */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-7 rounded-2xl shadow-lg border mb-10"
        >
          <h1 className="text-3xl font-bold text-[#0046FF]">
            Selamat Datang, {data.profile.name || "Guru"} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Semoga harimu menyenangkan! Berikut ringkasan konseling hari ini.
          </p>
        </motion.div>

        {/* Aksi Cepat */}
        <h2 className="text-xl font-semibold text-[#0046FF] mb-4">Aksi Cepat</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

          <QuickAction 
            icon={<FilePlus size={26} />} 
            label="Pengajuan Masuk" 
            href="/gurubk/pengajuan"
          />

          <QuickAction 
            icon={<Calendar size={26} />} 
            label="Jadwal Konseling" 
            href="/gurubk/jadwal"
          />

          <QuickAction 
            icon={<History size={26} />} 
            label="Riwayat" 
            href="/gurubk/riwayat"
          />

          <QuickAction 
            icon={<User size={26} />} 
            label="Profil Saya" 
            href="/profile"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<BookOpen size={26} className="text-[#0046FF]" />}
            title="Pengajuan Masuk"
            value={data.pengajuanMasuk}
          />

          <StatCard
            icon={<Calendar size={26} className="text-[#0046FF]" />}
            title="Jadwal Hari Ini"
            value={data.jadwalHariIni.length}
          />

          <StatCard
            icon={<Clock size={26} className="text-[#0046FF]" />}
            title="Riwayat Konseling"
            value={data.riwayat.length}
          />
        </div>

        {/* Jadwal Hari Ini */}
        <TableSection 
          title="Jadwal Konseling Hari Ini" 
          items={data.jadwalHariIni}
          columns={[
            { key: "student_name", label: "Nama Siswa" },
            { key: "scheduled_datetime", label: "Waktu" }
          ]}
        />

        {/* Riwayat */}
        <TableSection 
          title="Riwayat Konseling Terbaru" 
          items={data.riwayat}
          columns={[
            { key: "student_name", label: "Nama Siswa" },
            { key: "summary", label: "Ringkasan" }
          ]}
        />

      </div>
    </div>
  );
}

/* QUICK ACTION */
function QuickAction({ icon, label, href }) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={() => router.push(href)}
      className="bg-white shadow-md p-4 rounded-xl flex flex-col items-center justify-center 
                 cursor-pointer border select-none transition-all"
    >
      <div className="p-3 bg-[#0046FF]/10 text-[#0046FF] rounded-xl mb-2">
        {icon}
      </div>
      <p className="text-[#0046FF] font-medium text-center">{label}</p>
    </motion.div>
  );
}

/* STAT CARD */
function StatCard({ icon, title, value }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="rounded-2xl p-6 shadow-md bg-white border">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[#0046FF]/10 rounded-xl">{icon}</div>
        <div>
          <p className="text-lg font-medium text-[#0046FF]">{title}</p>
          <p className="text-4xl font-bold text-[#0046FF] mt-1">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* TABLE SECTION */
function TableSection({ title, items, columns }) {
  return (
    <div className="mt-14">
      <h2 className="text-2xl font-semibold text-[#0046FF] mb-4">{title}</h2>

      <div className="bg-white border rounded-2xl shadow p-6">
        {(!items || items.length === 0) ? (
          <p className="text-gray-500">Tidak ada data</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                {columns.map((col) => (
                  <th key={col.key} className="py-3 text-[#0046FF] font-medium">
                    {col.label}
                  </th>
                ))}
                <th className="py-3 text-[#0046FF] font-medium">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-gray-50"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 text-gray-700">
                      {col.key === "scheduled_datetime"
                        ? new Date(item[col.key]).toLocaleString()
                        : item[col.key] ?? "-"}
                    </td>
                  ))}
                  
                  <td className="py-3">
                    <ChevronRight className="text-[#0046FF] cursor-pointer" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
