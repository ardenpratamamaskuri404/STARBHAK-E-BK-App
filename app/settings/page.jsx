"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import NavbarAdmin from "@/components/NavbarAdmin";
import NavbarGuru from "@/components/NavbarGuru";
import NavbarSiswa from "@/components/NavbarSiswa";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const [loading, setLoading] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("id");

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-20">

      {/* Auto pilih navbar sesuai role */}
      {role === "admin" && <NavbarAdmin />}
      {role === "guru" && <NavbarGuru />}
      {role === "siswa" && <NavbarSiswa />}

      <div className="px-5 md:px-16 mt-28">

        <h1 className="text-3xl font-bold text-[#0046FF] mb-6">
          Pengaturan Akun
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ====================== GANTI EMAIL ====================== */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0046FF]">Ganti Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Email Baru" type="email" />

              <Button className="bg-[#0046FF] text-white hover:bg-blue-700 w-full">
                Simpan Perubahan
              </Button>
            </CardContent>
          </Card>

          {/* ====================== GANTI PASSWORD ====================== */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0046FF]">Ganti Password</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input placeholder="Password Lama" type="password" />
              <Input placeholder="Password Baru" type="password" />
              <Input placeholder="Konfirmasi Password Baru" type="password" />

              <Button className="bg-[#0046FF] text-white hover:bg-blue-700 w-full">
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* ====================== NOTIFIKASI ====================== */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0046FF]">Notifikasi</CardTitle>
            </CardHeader>

            <CardContent className="flex items-center justify-between py-4">
              <Label className="text-gray-700">Aktifkan Notifikasi</Label>
              <Switch
                checked={notifEnabled}
                onCheckedChange={setNotifEnabled}
              />
            </CardContent>
          </Card>

          {/* ====================== TEMA & BAHASA ====================== */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0046FF]">Preferensi</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-gray-700">Tema</Label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Bahasa</Label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>

              <Button className="bg-[#0046FF] w-full text-white hover:bg-blue-700">
                Simpan Preferensi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
