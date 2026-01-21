"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, ClipboardList, BookOpen, Users } from "lucide-react";
import NavbarSiswa from "@/components/NavbarSiswa";

export default function HomeSiswa() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const siswaName = session?.user?.name ? session.user.name.split(" ")[0] : "Siswa";

  const guruList = [
  { 
    id: 1, 
    nama: "Heni Siswati, S.Psi", 
    jabatan: "Guru BK", 
    quote: "Setiap hari adalah kesempatan baru untuk menjadi lebih baik.", 
    foto: "/heni.jpg" 
  },
  { 
    id: 2, 
    nama: "Ika Rafika, S.Pd", 
    jabatan: "Guru BK", 
    quote: "Kamu tidak sendirian. Selalu ada tempat untuk cerita.", 
    foto: "/ika.png"
  },
  { 
    id: 3, 
    nama: "Kasandra Fitriani. N, S.Pd", 
    jabatan: "Guru BK", 
    quote: "Prosesmu berharga. Teruslah melangkah.", 
    foto: "/kasandra.png" 
  },
  { 
    id: 4, 
    nama: "Nadya Afriliani Ariesta, S.Pd", 
    jabatan: "Guru BK", 
    quote: "Tidak masalah berjalan pelan, yang penting tetap maju.", 
    foto: "/nadya.png" 
  },
];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#0046FF] font-bold text-xl">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <NavbarSiswa />

      {/* MAIN CONTENT */}
      <div className="w-full flex-grow">
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">

          {/* WELCOME */}
          <section className="mb-14">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-md p-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#0046FF] mb-3">
                Selamat Datang, {siswaName}! 👋
              </h1>

              <p className="text-gray-700 max-w-3xl leading-relaxed mb-6">
                Selamat datang di E-BK STARBHAK — Ruang aman untuk curhat,
                konsultasi, dan berkembang menjadi versi terbaik dari dirimu.
                Kamu bisa melihat catatan, membaca riwayat, atau mulai ajukan
                konseling kapan pun kamu butuh bantuan.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push("/siswa/ajukan")}
                  className="inline-flex items-center gap-2 bg-[#6E8CFB] text-white px-5 py-3 rounded-xl font-semibold hover:opacity-95 transition"
                >
                  Ajukan Konseling
                </button>

                <Link
                  href="/siswa/riwayat"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                >
                  Lihat Riwayat
                </Link>
              </div>
            </div>
          </section>

          {/* AKSES CEPAT */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold text-[#0046FF] text-center mb-10">
              Akses Cepat
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                onClick={() => router.push("/siswa/ajukan")}
                className="p-8 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition cursor-pointer text-center"
              >
                <Calendar size={52} className="text-[#0046FF] mx-auto mb-5" />
                <h3 className="text-2xl font-bold text-[#0046FF] mb-3">Buat Janji</h3>
                <p className="text-gray-600">
                  Ajukan sesi konseling baru sesuai kebutuhanmu.
                </p>
              </div>

              <div
                onClick={() => router.push("/siswa/riwayat")}
                className="p-8 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition cursor-pointer text-center"
              >
                <ClipboardList size={52} className="text-[#0046FF] mx-auto mb-5" />
                <h3 className="text-2xl font-bold text-[#0046FF] mb-3">
                  Riwayat Konseling
                </h3>
                <p className="text-gray-600">
                  Lihat semua sesi konseling yang pernah kamu jalani.
                </p>
              </div>

              <div
                onClick={() => router.push("/siswa/catatan")}
                className="p-8 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition cursor-pointer text-center"
              >
                <BookOpen size={52} className="text-[#0046FF] mx-auto mb-5" />
                <h3 className="text-2xl font-bold text-[#0046FF] mb-3">
                  Catatan Pribadi
                </h3>
                <p className="text-gray-600">
                  Akses catatan pribadi dari guru BK mengenai perkembanganmu.
                </p>
              </div>
            </div>
          </section>

          {/* GURU BK */}
          <section>
            <h2 className="text-3xl font-bold text-[#0046FF] text-center mb-10">
              Guru BK Tersedia
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guruList.map((guru) => (
                <div
                  key={guru.id}
                  className="bg-white border border-gray-100 rounded-3xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition text-center"
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#6E8CFB] mb-4">
                    <Image
                      src={guru.foto}
                      alt={guru.nama}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-[#0046FF] mb-1">
                    {guru.nama}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{guru.jabatan}</p>

                  <p className="text-gray-500 italic text-sm mb-5 px-3">
                    “{guru.quote}”
                  </p>

                  <button
                    onClick={() => router.push(`/siswa/ajukan?guru=${guru.id}`)}
                    className="w-full bg-gradient-to-r from-[#0046FF] to-[#6E8CFB] text-white py-2.5 rounded-xl font-semibold hover:opacity-95 transition"
                  >
                    Buat Janji
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} E-BK SMK Taruna Bhakti — Dikembangkan oleh Siswa RPL
        </div>
      </footer>
    </div>
  );
}
