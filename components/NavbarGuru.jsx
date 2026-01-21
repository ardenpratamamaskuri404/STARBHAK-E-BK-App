"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Calendar,
  History,
  LayoutDashboard,
  Inbox,
  UserCircle,
  LogOut,
  Settings
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function NavbarGuru() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [openMobile, setOpenMobile] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = [
    { name: "Beranda", href: "/gurubk/home", icon: Home },
    { name: "Pengajuan Masuk", href: "/gurubk/pengajuan", icon: Inbox },
    { name: "Jadwal Konseling", href: "/gurubk/jadwal", icon: Calendar },
    { name: "Riwayat", href: "/gurubk/riwayat", icon: History },
    { name: "Dashboard", href: "/gurubk/dashboard", icon: LayoutDashboard },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarUrl =
  session?.user?.avatar_url?.startsWith("/uploads/")
    ? session.user.avatar_url
    : "/images/avatar-default.png";

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-300 shadow-sm z-50">
      <div className="w-full px-4 md:px-10 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/gurubk/home" className="flex items-center gap-3">
          <img src="/logo-tb.png" className="w-10 h-10" alt="Logo" />
          <span className="text-xl font-bold tracking-wide text-[#0046FF]">
            E-BK STARBHAK
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center font-medium">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-2 transition group
                  ${isActive ? "text-[#0046FF]" : "text-gray-700"}
                  hover:text-[#0046FF"]
                `}
              >
                <item.icon
                  size={19}
                  className={`
                    transition
                    ${isActive ? "text-[#0046FF]" : "text-gray-900"}
                    group-hover:text-[#0046FF]
                  `}
                />
                {item.name}
              </Link>
            );
          })}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#0046FF] ring-2 ring-transparent group-hover:ring-[#7aa9ff] transition">
                <img src={avatarUrl} alt="Guru" className="w-full h-full object-cover" />
              </div>

              <span className="font-semibold text-gray-700 group-hover:text-[#0046FF] hidden lg:block">
                {session?.user?.name || "Guru BK"}
              </span>
            </button>

            {/* Dropdown Content */}
            {openProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border overflow-hidden">

                {/* Header Blue */}
                <div className="p-5 bg-[#0046FF] text-white">
                  <p className="font-bold text-lg">{session?.user?.name}</p>
                  <p className="text-sm opacity-90">Guru Bimbingan Konseling</p>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-gray-100 transition"
                >
                  <UserCircle size={20} className="text-black" />
                  <span className="text-black font-medium">Profil Saya</span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-gray-100 transition border-t"
                >
                  <Settings size={20} className="text-black" />
                  <span className="text-black font-medium">Pengaturan</span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 transition border-t"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#0046FF]"
          onClick={() => setOpenMobile(!openMobile)}
        >
          {openMobile ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {openMobile && (
        <div className="md:hidden bg-white border-t px-6 pb-6 pt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpenMobile(false)}
                className={`
                  flex items-center gap-4 py-3 font-medium transition
                  ${isActive ? "text-[#0046FF]" : "text-gray-700"}
                  hover:text-[#0046FF]
                `}
              >
                <item.icon
                  size={22}
                  className={`${isActive ? "text-[#0046FF]" : "text-gray-900"}`}
                />
                {item.name}
              </Link>
            );
          })}

          {/* Profile Section */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#0046FF]">
                <img src={avatarUrl} alt="Guru" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold">{session?.user?.name}</p>
                <p className="text-sm text-gray-500">Guru BK</p>
              </div>
            </div>

            <Link href="/profile" onClick={() => setOpenMobile(false)} className="block py-3">
              Profil Saya
            </Link>

            <Link href="/settings" onClick={() => setOpenMobile(false)} className="block py-3">
              Pengaturan
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="block py-3 text-red-600 w-full text-left font-medium mt-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
