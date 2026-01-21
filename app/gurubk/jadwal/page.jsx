"use client";

import { useEffect, useState } from "react";
import NavbarGuru from "@/components/NavbarGuru";
import { motion } from "framer-motion";
import { Calendar, User, Clock } from "lucide-react";

export default function JadwalGuru() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/guru/jadwal")
      .then((res) => res.json())
      .then((d) => {
        setJadwal(d.jadwal || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <NavbarGuru />

      <div className="p-8 pt-24">
        <h1 className="text-3xl font-bold text-[#0046FF] mb-6">
          Jadwal Konseling
        </h1>

        <div className="bg-white p-6 shadow-md border rounded-2xl">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : jadwal.length === 0 ? (
            <p className="text-gray-500">Tidak ada jadwal konseling.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 text-[#0046FF] font-semibold">Siswa</th>
                  <th className="py-3 text-[#0046FF] font-semibold">Judul</th>
                  <th className="py-3 text-[#0046FF] font-semibold">Tanggal</th>
                  <th className="py-3 text-[#0046FF] font-semibold">Jam</th>
                </tr>
              </thead>

              <tbody>
                {jadwal.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <User className="text-[#0046FF]" size={20} />
                        <div>
                          <p className="text-[#0046FF] font-medium">
                            {item.student_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.student_email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3">{item.title}</td>

                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-[#0046FF]" />
                        {item.scheduled_date}
                      </div>
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-[#0046FF]" />
                        {item.scheduled_time}
                      </div>
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
