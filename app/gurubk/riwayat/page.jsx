"use client";

import { useEffect, useState } from "react";
import NavbarGuru from "@/components/NavbarGuru";
import { motion } from "framer-motion";
import { Clock, User, Printer } from "lucide-react";

export default function RiwayatGuru() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/guru/riwayat")
      .then(res => res.json())
      .then(d => {
        setRiwayat(d.riwayat || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <NavbarGuru />

      <div className="p-8 pt-24">
        <h1 className="text-3xl font-bold text-[#0046FF] mb-6">
          Riwayat Konseling
        </h1>

        <div className="bg-white p-6 shadow-md border rounded-2xl">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : riwayat.length === 0 ? (
            <p className="text-gray-500">Belum ada riwayat konseling.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 text-[#0046FF] font-semibold">Siswa</th>
                  <th className="py-3 text-[#0046FF] font-semibold">Judul</th>
                  <th className="py-3 text-[#0046FF] font-semibold">Tanggal</th>
                  <th className="py-3 text-[#0046FF] font-semibold">Ringkasan</th>
                  <th className="py-3 text-[#0046FF] font-semibold text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {riwayat.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b hover:bg-gray-50"
                  >
                    {/* Nama siswa */}
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <User className="text-[#0046FF]" size={20} />
                        <p className="text-[#0046FF] font-medium">
                          {item.student_name}
                        </p>
                      </div>
                    </td>

                    {/* Judul */}
                    <td className="py-4">{item.title}</td>

                    {/* Tanggal */}
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-[#0046FF]" />
                        {item.completed_at
                          ? new Date(item.completed_at).toLocaleString()
                          : "-"}
                      </div>
                    </td>

                    {/* Ringkasan */}
                    <td className="py-4 max-w-[250px] truncate">
                      {item.summary || "-"}
                    </td>

                    {/* Tombol cetak */}
                    <td className="py-4 text-center">
                      <button
                        className="bg-[#0046FF] hover:bg-[#0036cc] px-4 py-2 text-white rounded-lg shadow flex items-center gap-2 mx-auto"
                        onClick={() =>
                          window.open(`/api/guru/riwayat/pdf?id=${item.id}`)
                        }
                      >
                        <Printer size={18} /> Cetak
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
