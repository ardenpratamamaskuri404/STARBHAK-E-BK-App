"use client";

import { useEffect, useState } from "react";
import NavbarSiswa from "@/components/NavbarSiswa";
import { Loader2, Calendar, Clock, User } from "lucide-react";

export default function RiwayatKonseling() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/siswa/riwayat");
        const json = await res.json();

        if (json.riwayat) setData(json.riwayat);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const badgeClass = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-semibold";

    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      completed: "bg-blue-100 text-blue-700",
    };

    return `${base} ${styles[status] ?? "bg-gray-200 text-gray-600"}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarSiswa />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-4xl font-extrabold text-[#0046FF] mb-10 text-center">
          Riwayat Konseling
        </h1>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#0046FF]" size={40} />
          </div>
        )}

        {/* Empty */}
        {!loading && data.length === 0 && (
          <div className="text-center text-gray-600 py-24 text-lg">
            Belum ada riwayat konseling.
            <br />
            <span className="text-[#0046FF] font-semibold">
              Ayo ajukan konseling pertama kamu! 💬
            </span>
          </div>
        )}

        {/* List Riwayat */}
        <div className="space-y-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 p-6 rounded-3xl shadow-md hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-[#0046FF] text-lg">
                  Konseling dengan {item.teacher_name}
                </div>

                <span className={badgeClass(item.status)}>
                  {item.status.toUpperCase()}
                </span>
              </div>

              {/* Detail */}
              <div className="space-y-2 text-gray-700">

                <div className="flex items-center gap-2">
                  <User size={18} className="text-[#6E8CFB]" />
                  <span className="font-medium">{item.teacher_name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#6E8CFB]" />
                  <span>
                    Pengajuan:{" "}
                    {new Date(item.requested_at).toLocaleString("id-ID")}
                  </span>
                </div>

                {item.approved_at && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-green-600" />
                    <span>
                      Disetujui:{" "}
                      {new Date(item.approved_at).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}

                {/* Deskripsi */}
                <div className="mt-4 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed">
                  <span className="font-semibold text-gray-700">Deskripsi:</span>
                  <br />
                  {item.description || "Tidak ada deskripsi"}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
