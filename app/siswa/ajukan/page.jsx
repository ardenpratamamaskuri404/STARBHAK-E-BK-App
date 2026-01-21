"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavbarSiswa from "@/components/NavbarSiswa";
import { Loader2 } from "lucide-react";

export default function AjukanKonseling() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [guruList, setGuruList] = useState([]);
  const [loadingGuru, setLoadingGuru] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [teacherId, setTeacherId] = useState("");
  const [datetime, setDatetime] = useState("");
  const [reason, setReason] = useState("");

  // ===== Fetch daftar guru BK =====
  useEffect(() => {
    async function fetchGuru() {
      try {
        const res = await fetch("/api/siswa/guru");
        const json = await res.json();
        if (json.success) setGuruList(json.data);
      } catch (error) {
        console.error("Gagal memuat guru:", error);
      } finally {
        setLoadingGuru(false);
      }
    }
    fetchGuru();
  }, []);

  // ===== Session loading =====
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#0046FF] text-xl">
        Memuat...
      </div>
    );
  }

  // ===== Redirect jika tidak login =====
  if (!session) {
    router.push("/login");
    return null;
  }

  // ===== Submit Form =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teacherId || !datetime || !reason.trim()) {
      alert("Semua field wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/siswa/pengajuan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher_id: teacherId,
          preferred_datetime: datetime,
          reason: reason,
        }),
      });

      const json = await res.json();

      if (json.success) {
        alert("Pengajuan konseling berhasil dikirim!");
        router.push("/siswa/riwayat");
      } else {
        alert(json.message || "Gagal mengajukan konseling");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarSiswa />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Judul */}
        <h1 className="text-4xl font-extrabold text-[#0046FF] mb-6 text-center">
          Ajukan Konseling
        </h1>

        <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
          Silakan isi formulir berikut untuk mengajukan sesi konseling bersama Guru BK.
        </p>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 shadow-lg rounded-3xl p-8 space-y-6"
        >
          {/* Pilih Guru */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Pilih Guru BK
            </label>

            {loadingGuru ? (
              <div className="text-gray-500">Memuat guru...</div>
            ) : (
              <select
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6E8CFB]"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
              >
                <option value="">-- Pilih Guru --</option>
                {guruList.map((guru) => (
                  <option key={guru.id} value={guru.id}>
                    {guru.name} ({guru.jabatan})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tanggal & Jam */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Pilih Tanggal & Jam
            </label>
            <input
              type="datetime-local"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6E8CFB]"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </div>

          {/* Alasan */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Alasan Konseling
            </label>
            <textarea
              rows={5}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6E8CFB]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Jelaskan alasan kamu mengajukan konseling..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#0046FF] to-[#6E8CFB] text-white p-4 rounded-xl font-semibold hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Mengirim...
              </>
            ) : (
              "Kirim Pengajuan"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
