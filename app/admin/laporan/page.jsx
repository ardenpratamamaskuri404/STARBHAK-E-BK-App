// app/admin/laporan/page.jsx → VERSI FINAL DENGAN CETAK PDF GACOR
"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, FileText, Calendar, Download } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

// Styles untuk PDF
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", backgroundColor: "#fff" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center", color: "#0046FF", fontWeight: "bold" },
  header: { fontSize: 12, marginBottom: 10, color: "#333" },
  section: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: "bold", color: "#0046FF", marginBottom: 5 },
  text: { fontSize: 11, lineHeight: 1.6, color: "#333" },
  followUp: { backgroundColor: "#FEF3C7", padding: 12, borderRadius: 8, marginTop: 10 }
});

// Komponen PDF per laporan
const LaporanPDF = ({ laporan }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>LAPORAN KONSELING SISWA</Text>
      
      <View style={styles.section}>
        <Text style={styles.header}>Nama Siswa      : {laporan.siswa_name}</Text>
        <Text style={styles.header}>Guru BK         : {laporan.guru_name}</Text>
        <Text style={styles.header}>Tanggal Konseling : {new Date(laporan.jadwal_datetime).toLocaleDateString("id-ID", {weekday: "long", year: "numeric", month: "long", day: "numeric"})}</Text>
        <Text style={styles.header}>Dibuat pada     : {new Date(laporan.created_at).toLocaleDateString("id-ID")}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Ringkasan Konseling:</Text>
        <Text style={styles.text}>{laporan.summary}</Text>
      </View>

      {laporan.detail && (
        <View style={styles.section}>
          <Text style={styles.label}>Detail Lengkap:</Text>
          <Text style={styles.text}>{laporan.detail}</Text>
        </View>
      )}

      {laporan.follow_up && (
        <View style={styles.section}>
          <Text style={styles.label}>Rencana Tindak Lanjut:</Text>
          <View style={styles.followUp}>
            <Text style={styles.text}>{laporan.follow_up}</Text>
          </View>
        </View>
      )}

      <Text style={{ position: "absolute", bottom: 40, left: 40, right: 0, textAlign: "center", fontSize: 10, color: "grey" }}>
        Dicetak dari Sistem BK Digital • {new Date().toLocaleString("id-ID")}
      </Text>
    </Page>
  </Document>
);

export default function LaporanKonselingAdmin() {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGuru, setFilterGuru] = useState("");
  const [filterBulan, setFilterBulan] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/laporan");
        const data = await res.json();
        setLaporan(data);
      } catch (err) {
        toast.error("Gagal memuat laporan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const guruList = [...new Set(laporan.map(l => l.guru_name))];

  const filteredLaporan = useMemo(() => {
    return laporan.filter(l => {
      const search = searchTerm.toLowerCase();
      const matchSearch = l.siswa_name.toLowerCase().includes(search) || 
                         l.summary.toLowerCase().includes(search);
      const matchGuru = !filterGuru || l.guru_name === filterGuru;
      const matchBulan = !filterBulan || new Date(l.jadwal_datetime).toISOString().slice(0,7) === filterBulan;
      return matchSearch && matchGuru && matchBulan;
    });
  }, [laporan, searchTerm, filterGuru, filterBulan]);

  const formatDate = (date) => new Date(date).toLocaleDateString("id-ID", {day: "numeric", month: "long", year: "numeric"});

  if (loading) return <div className="min-h-screen bg-gray-50 flex-center"><div className="text-3xl font-bold text-[#0046FF]">Loading...</div></div>;

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-extrabold text-[#0046FF] flex items-center gap-4">
                <FileText size={48} /> Laporan Konseling
              </h1>
              <p className="text-xl text-gray-600 mt-2">Monitoring hasil konseling • Bisa cetak PDF langsung</p>
            </div>

            {/* Tombol Cetak Semua (opsional nanti) */}
            {filteredLaporan.length > 0 && (
              <PDFDownloadLink
                document={<LaporanPDF laporan={filteredLaporan[0]} />}
                fileName={`laporan-konseling-${new Date().toISOString().slice(0,10)}.pdf`}
              >
                {({ loading }) => (
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                    <Download size={20} /> {loading ? "Sedang buat PDF..." : "Download PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            )}
          </div>

          {/* Filter */}
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari siswa / isi laporan..." className="pl-12 pr-5 py-4 w-full rounded-xl border" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="px-5 py-4 rounded-xl border" value={filterGuru} onChange={e => setFilterGuru(e.target.value)}>
              <option value="">Semua Guru</option>
              {guruList.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <input type="month" className="px-5 py-4 rounded-xl border" value={filterBulan} onChange={e => setFilterBulan(e.target.value)} />
          </div>

          {/* Daftar Laporan + Tombol Cetak Per Item */}
          <div className="space-y-8">
            {filteredLaporan.map((l) => (
              <div key={l.id} className="bg-white rounded-3xl shadow-xl border hover:shadow-2xl transition p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#0046FF]">{l.siswa_name}</h3>
                    <p className="text-gray-600">Oleh: {l.guru_name} • {formatDate(l.jadwal_datetime)}</p>
                  </div>

                  {/* TOMBOL CETAK PDF PER LAPORAN */}
                  <PDFDownloadLink document={<LaporanPDF laporan={l} />} fileName={`Laporan-${l.siswa_name.replace(/\s+/g, '-')}-${new Date(l.jadwal_datetime).toISOString().slice(0,10)}.pdf`}>
                    {({ blob, url, loading, error }) => (
                      <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition">
                        <Download size={20} />
                        {loading ? "Sedang buat PDF..." : "Cetak PDF"}
                      </button>
                    )}
                  </PDFDownloadLink>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-700">Ringkasan:</p>
                    <div className="bg-blue-50 p-4 rounded-xl text-blue-900 mt-2">{l.summary}</div>
                  </div>
                  {l.detail && (
                    <div>
                      <p className="font-semibold text-gray-700">Detail:</p>
                      <div className="bg-gray-50 p-4 rounded-xl mt-2">{l.detail}</div>
                    </div>
                  )}
                  {l.follow_up && (
                    <div>
                      <p className="font-semibold text-amber-700">Follow Up:</p>
                      <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl mt-2 text-amber-900">{l.follow_up}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredLaporan.length === 0 && (
            <div className="text-center py-20">
              <FileText size={80} className="mx-auto text-gray-300 mb-6" />
              <p className="text-2xl text-gray-500">Belum ada laporan konseling</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}