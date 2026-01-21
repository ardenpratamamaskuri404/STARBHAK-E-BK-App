"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, User, BookOpen, Info } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [data, setData] = useState({
    name: "",
    email: "",
    role: "",
    avatar_url: "",
    nip: "",
    mata_pelajaran: "",
    jabatan: "",
    bio: "",
    nis: "",
    kelas: "",
    jurusan: "",
    wali_kelas: "",
    admin_phone: "",
    admin_address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/api/profile");
      const json = await res.json();

      setData(json.user);
      setLoading(false);
    };
    getData();
  }, []);

 const handleSave = async () => {
  setSaving(true);

  await fetch("/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });

  // Refresh session
  await update({
    name: data.name,
    email: data.email,
    avatar_url: data.avatar_url
  });

  setSaving(false);
};


  const handleAvatar = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);

  const form = new FormData();
  form.append("avatar", file);

  const res = await fetch("/api/profile", {
    method: "POST",
    body: form,
  });

  const { avatar_url } = await res.json();

  setData((prev) => ({ ...prev, avatar_url }));

  await update({ avatar_url });

  setUploading(false);
};


  const getDashboardLink = (role) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "guru":
      return "/gurubk/dashboard";
    case "siswa":
      return "/siswa/dashboard";
    default:
      return "/dashboard";
  }
};

  const avatarSrc =
  data.avatar_url && data.avatar_url !== ""
    ? data.avatar_url
    : "/images/avatar-default.png";


  if (loading) return <p className="p-5">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* HEADER */}
      <div
        className="py-5 px-6 rounded-2xl mb-8 text-white shadow-lg flex items-center gap-4"
        style={{
          background: "linear-gradient(90deg, #0046FF, #6E8CFB)"
        }}
      >
          <Link
    href={getDashboardLink(data.role)}
    className="hover:opacity-80 transition"
  >
    <ArrowLeft size={30} className="text-white" />
  </Link>

        <h1 className="text-3xl font-bold tracking-wide">
          Profile Saya
        </h1>
      </div>

      <Card className="p-8 shadow-xl border border-gray-200 rounded-3xl">
        <CardContent className="space-y-8">

          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-[#6E8CFB] shadow-xl object-cover"
              />

              <label className="absolute bottom-1 right-1 bg-[#0046FF] hover:bg-blue-700 p-2 rounded-full cursor-pointer shadow-md">
                <Camera size={20} className="text-white" />
                <input type="file" accept="image/*" onChange={handleAvatar} hidden />
              </label>
            </div>

            <div>
              <p className="text-sm text-gray-600">Foto Profil</p>
              <p className="font-semibold">{uploading ? "Mengunggah..." : "Klik icon kamera untuk mengganti"}</p>
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <label className="font-semibold text-gray-700">Nama Lengkap</label>
            <Input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Email</label>
            <Input
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Role</label>
            <Input value={data.role} disabled className="mt-1 bg-gray-200" />
          </div>

          {data.role === "guru" && (
            <div className="space-y-6 border-t pt-6">
              <h2 className="font-bold text-xl flex items-center gap-2 text-[#0046FF]">
                <BookOpen /> Informasi Guru
              </h2>

              <Input
                placeholder="NIP"
                value={data.nip}
                onChange={(e) => setData({ ...data, nip: e.target.value })}
              />

              <Input
                placeholder="Mata Pelajaran"
                value={data.mata_pelajaran}
                onChange={(e) => setData({ ...data, mata_pelajaran: e.target.value })}
              />

              <Input
                placeholder="Jabatan"
                value={data.jabatan}
                onChange={(e) => setData({ ...data, jabatan: e.target.value })}
              />

              <textarea
                rows={3}
                placeholder="Bio Guru"
                className="w-full border rounded-xl p-3"
                value={data.bio}
                onChange={(e) => setData({ ...data, bio: e.target.value })}
              />
            </div>
          )}

          {data.role === "siswa" && (
            <div className="space-y-6 border-t pt-6">
              <h2 className="font-bold text-xl flex items-center gap-2 text-[#0046FF]">
                <User /> Data Siswa
              </h2>

              <Input
                placeholder="NIS / NISN"
                value={data.nis}
                onChange={(e) => setData({ ...data, nis: e.target.value })}
              />

              <Input
                placeholder="Kelas"
                value={data.kelas}
                onChange={(e) => setData({ ...data, kelas: e.target.value })}
              />

              <Input
                placeholder="Jurusan"
                value={data.jurusan}
                onChange={(e) => setData({ ...data, jurusan: e.target.value })}
              />

              <Input
                placeholder="Wali Kelas"
                value={data.wali_kelas}
                onChange={(e) => setData({ ...data, wali_kelas: e.target.value })}
              />

              <textarea
                placeholder="Bio Siswa"
                rows={3}
                className="w-full border rounded-xl p-3"
                value={data.bio}
                onChange={(e) => setData({ ...data, bio: e.target.value })}
              />
            </div>
          )}

          {data.role === "admin" && (
            <div className="space-y-6 border-t pt-6">
              <h2 className="font-bold text-xl flex items-center gap-2 text-[#0046FF]">
                <Info /> Informasi Admin
              </h2>

              <Input
                placeholder="No. Telepon"
                value={data.admin_phone}
                onChange={(e) => setData({ ...data, admin_phone: e.target.value })}
              />

              <Input
                placeholder="Alamat Kantor"
                value={data.admin_address}
                onChange={(e) => setData({ ...data, admin_address: e.target.value })}
              />

              <textarea
                placeholder="Catatan Admin"
                rows={3}
                className="w-full border rounded-xl p-3"
                value={data.bio}
                onChange={(e) => setData({ ...data, bio: e.target.value })}
              />
            </div>
          )}

          {/* SAVE BUTTON */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-6 text-lg font-semibold text-white shadow-lg rounded-xl"
            style={{
              background: "linear-gradient(90deg, #0046FF, #6E8CFB)"
            }}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
