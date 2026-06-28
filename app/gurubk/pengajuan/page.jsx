"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Clock, FileText, CheckCircle, XCircle } from "lucide-react";

export default function PengajuanMasukGuru() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("/api/guru/pengajuan")
      .then((res) => res.json())
      .then((d) => setList(d.pengajuan || []));
  }, []);

  const approve = async (id) => {
    await fetch(`/api/guru/pengajuan/${id}/approve`, { method: "POST" });
    setList(list.filter((p) => p.id !== id));
  };

  const reject = async (id) => {
    await fetch(`/api/guru/pengajuan/${id}/reject`, { method: "POST" });
    setList(list.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
    <div className="p-8">

        <h1 className="text-3xl font-bold text-[#0046FF] mb-6">
          Pengajuan Masuk
        </h1>

        <div className="bg-white shadow-md border rounded-2xl p-6">

          {list.length === 0 ? (
            <p className="text-gray-500">Tidak ada pengajuan baru.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 text-[#0046FF] font-medium">Siswa</th>
                  <th className="py-3 text-[#0046FF] font-medium">Judul</th>
                  <th className="py-3 text-[#0046FF] font-medium">Diajukan</th>
                  <th className="py-3 text-[#0046FF] font-medium text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {list.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 flex items-center gap-3">
                      <User className="text-[#0046FF]" size={22} />
                      <div>
                        <p className="font-medium text-[#0046FF]">{item.student_name}</p>
                        <p className="text-xs text-gray-500">{item.student_email}</p>
                      </div>
                    </td>

                    <td className="py-3">{item.title}</td>

                    <td className="py-3 text-sm text-gray-600">
                      {new Date(item.requested_at).toLocaleString()}
                    </td>

                    <td className="py-3">
                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() => approve(item.id)}
                          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 px-3 py-1 text-white rounded-lg text-sm"
                        >
                          <CheckCircle size={16} /> Setujui
                        </button>

                        <button
                          onClick={() => reject(item.id)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1 text-white rounded-lg text-sm"
                        >
                          <XCircle size={16} /> Tolak
                        </button>

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
