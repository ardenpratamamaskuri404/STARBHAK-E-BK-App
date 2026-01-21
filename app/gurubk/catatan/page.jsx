"use client";

import { useState } from "react";
import SiswaSelector from "./components/SiswaSelector";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react"; // optional kalau pakai lucide-react

export default function CatatanBKPage() {
  const [selected, setSelected] = useState(null);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [kategori, setKategori] = useState("pribadi");

  async function submitForm(e) {
    e.preventDefault();

    if (!selected) {
      alert("Silakan pilih siswa terlebih dahulu");
      return;
    }

    const res = await fetch("/api/catatan/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: selected.id,
        teacher_id: 1,
        judul,
        isi,
        kategori,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Catatan berhasil disimpan!");
      setJudul("");
      setIsi("");
      setKategori("pribadi");
      setSelected(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex justify-center items-start p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl relative"
      >
        {/* Tombol Back */}
        <Link href="/gurubk/dashboard" className="absolute left-6 top-6 flex items-center gap-2 text-[#0046FF] hover:opacity-70">
          <ArrowLeft size={22} />
          <span className="font-semibold">Kembali</span>
        </Link>

        <h1 className="text-3xl font-bold text-[#0046FF] mb-4 text-center">
          Buat Catatan BK
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          Isi catatan untuk siswa dengan memilih dari daftar.
        </p>

        {/* Search siswa */}
        <SiswaSelector onSelect={setSelected} />

        {selected && (
          <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="font-semibold text-[#0046FF] text-lg">{selected.name}</p>
            <p className="text-gray-700">NIS: {selected.nis}</p>
            <p className="text-gray-700">Kelas: {selected.kelas}</p>
          </div>
        )}

        <form onSubmit={submitForm} className="mt-6 space-y-5">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Judul Catatan</label>
            <input
              type="text"
              placeholder="Masukkan judul catatan"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Isi Catatan</label>
            <textarea
              placeholder="Tuliskan catatan bimbingan..."
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              className="border rounded-xl p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="border rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="pribadi">Pribadi</option>
              <option value="perilaku">Perilaku</option>
              <option value="kehadiran">Kehadiran</option>
              <option value="akademik">Akademik</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-[#0046FF] text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            Simpan Catatan
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
