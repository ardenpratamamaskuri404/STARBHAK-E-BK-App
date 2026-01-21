"use client";

import { useEffect, useState } from "react";
import NavbarSiswa from "@/components/NavbarSiswa";

export default function CatatanSiswa() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/catatan");
      const json = await res.json();
      if (json.success) setData(json.data);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarSiswa />

      <div className="max-w-4xl mx-auto pt-28 px-6">
        <h1 className="text-3xl font-bold text-[#0046FF] mb-6">Catatan Saya</h1>

        <div className="space-y-4">
          {data.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-xl shadow border">
              <p className="text-xl font-bold">{c.judul}</p>
              <p className="text-gray-500">{c.kategori}</p>
              <p className="mt-2">{c.isi}</p>
              <p className="text-sm text-gray-400 mt-3">
                Dibuat oleh: {c.teacher_name} • {c.created_at}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
