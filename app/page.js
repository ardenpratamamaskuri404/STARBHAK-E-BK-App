"use client";

import { motion } from "framer-motion";
import { Calendar, Users, Headphones } from "lucide-react";
import NavbarLanding from "@/components/NavbarLanding"; // 🔥 pakai navbar component

export default function LandingPage() {
  return (
    <>
      {/* NAVBAR COMPONENT */}
      <NavbarLanding />

      {/* HERO SECTION */}
      <section className="min-h-screen pt-32 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-5">
          
          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center"
          >
            {/* Logo & Title */}
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo-tb.png" className="w-14 h-14" alt="Logo" />
              <div>
                <h2 className="text-2xl font-bold text-[#0046FF]">
                  E-BK SMK Taruna Bhakti
                </h2>
                <p className="text-gray-600 text-sm">
                  Sistem Informasi Bimbingan Konseling
                </p>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-[#0046FF] leading-tight">
              Sistem Informasi <br /> Bimbingan Konseling <br /> SMK Taruna Bhakti
            </h1>

            <p className="mt-5 text-lg text-gray-600 max-w-md">
              Layanan BK digital mulai dari penjadwalan, konsultasi,
              pengelolaan data, hingga riwayat pertemuan.
            </p>

            <div className="mt-8">
              <button
                onClick={() => (window.location.href = "/auth/login")}
                className="px-6 py-3 bg-[#6E8CFB] text-white font-semibold rounded-lg hover:opacity-90 transition"
              >
                Mulai Sekarang
              </button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center items-center"
          >
            <img
              src="/logo-konseling.png"
              className="w-[90%] drop-shadow-xl"
              alt="Konseling"
            />
          </motion.div>
        </div>
      </section>

    <section id="fitur" className="py-20 bg-white">
<div className="max-w-7xl mx-auto px-6">
<h2 className="text-3xl md:text-4xl font-bold text-center text-[#0046FF] mb-14">
Layanan yang Tersedia
</h2>


<div className="grid grid-cols-1 md:grid-cols-3 gap-10">


{/* KARTU 1 — BUAT JANJI BK */}
<div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition cursor-pointer border border-gray-200">
<div className="flex justify-center mb-6">
<Calendar className="text-[#0046FF]" size={50} />
</div>
<h3 className="text-2xl font-bold text-[#0046FF] text-center mb-3">
Buat Janji BK
</h3>
<p className="text-gray-600 text-center text-sm leading-relaxed">
Siswa dapat mengajukan konsultasi kapan saja.
</p>
</div>


{/* KARTU 2 — CATATAN KONSELING */}
<div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition cursor-pointer border border-gray-200">
<div className="flex justify-center mb-6">
<Users className="text-[#0046FF]" size={50} />
</div>
<h3 className="text-2xl font-bold text-[#0046FF] text-center mb-3">
Catatan Konseling Pribadi
</h3>
<p className="text-gray-600 text-center text-sm leading-relaxed">
Semua curhatan & saran dari BK tersimpan rapi di sini.
</p>
</div>


{/* KARTU 3 — EMERGENCY SUPPORT */}
<div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition cursor-pointer border border-gray-200">
<div className="flex justify-center mb-6">
<Headphones className="text-[#0046FF]" size={50} />
</div>
<h3 className="text-2xl font-bold text-[#0046FF] text-center mb-3">
Emergency Support (24/7)
</h3>
<p className="text-gray-600 text-center text-sm leading-relaxed">
Terhubung dalam hitungan menit dengan guru BK.
</p>
</div>


</div>
</div>
</section>


      {/* TENTANG SECTION */}
      <section id="tentang" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* LEFT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex justify-center items-center"
          >
            <img
              src="/smk-tb.png"
              className="w-[90%] rounded-2xl shadow-lg"
              alt="SMK TB"
            />
          </motion.div>

          {/* RIGHT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0046FF] mb-5">
              Tentang Layanan BK SMK Taruna Bhakti
            </h2>

            <p className="text-gray-600 leading-relaxed text-lg">
              Bimbingan Konseling hadir untuk membantu siswa dalam pengembangan pribadi,
              sosial, akademik, dan karier. E-BK membuat layanan ini lebih mudah diakses
              dan efisien.
            </p>

            <p className="mt-4 text-gray-600 leading-relaxed text-lg">
              Dengan sistem digital, siswa dapat membuat janji BK, melihat riwayat,
              dan berkomunikasi dengan guru BK secara efektif.
            </p>

            <div className="mt-6 p-5 bg-[#f5f7ff] border-l-4 border-[#0046FF] rounded">
              <p className="text-[#0046FF] font-semibold text-lg">
                “E-BK membantu siswa mendapatkan pendampingan terbaik secara cepat dan aman.”
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 bg-white border-t">
        <div className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} E-BK SMK Taruna Bhakti  — Dikembangkan Oleh Siswa RPL
        </div>
      </footer>
    </>
  );
}
