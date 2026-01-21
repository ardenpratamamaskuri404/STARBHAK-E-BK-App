"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Home, Users, UserCheck, Calendar, FileText, LogOut, UserCircle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function NavbarAdmin() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [openMobile, setOpenMobile] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Manajemen Siswa", href: "/admin/siswa", icon: Users },
    { name: "Manajemen Guru", href: "/admin/guru", icon: UserCheck },
    { name: "Jadwal Konseling", href: "/admin/jadwal", icon: Calendar },
    { name: "Laporan Konseling", href: "/admin/laporan", icon: FileText },
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
    <nav className="fixed top-0 left-0 w-full bg-white text-black border-b border-gray-300 shadow-sm z-50">
      <div className="w-full px-4 md:px-10 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <img src="/logo-tb.png" className="w-10 h-10" alt="Logo" />
          <span className="text-xl font-bold tracking-wide text-[#0046FF]">
            Admin E-BK
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
                  hover:text-[#0046FF]
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

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#0046FF] ring-2 ring-transparent group-hover:ring-[#7aa9ff] transition">
                <img src={avatarUrl} alt="Admin" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-[#0046FF] transition hidden lg:block">
                {session?.user?.name || "Admin BK"}
              </span>
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border overflow-hidden">

                {/* Header Blue */}
                <div className="p-5 bg-[#0046FF] text-white">
                  <p className="font-bold text-lg">{session?.user?.name}</p>
                  <p className="text-sm opacity-90">Administrator E-BK</p>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-gray-100 transition"
                >
                  <UserCircle size={20} className="text-gray-700" />
                  Profil Saya
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-gray-100 transition border-t"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="
        M10.325 4.317c.426-1.756 2.924-1.756 3.35 0
        a1.724 1.724 0 002.573 1.066c1.543-.94 
        3.31.826 2.37 2.37a1.724 1.724 0 
        001.065 2.572c1.756.426 1.756 2.924 
        0 3.35a1.724 1.724 0 00-1.066 2.573c.94 
        1.543-.826 3.31-2.37 2.37a1.724 1.724 
        0 00-2.572 1.065c-.426 1.756-2.924 
        1.756-3.35 0a1.724 1.724 0 00-2.573-1.066
        c-1.543.94-3.31-.826-2.37-2.37a1.724 
        1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 
        0-3.35a1.724 1.724 0 001.066-2.573
        c-.94-1.543.826-3.31 2.37-2.37.996.608 
        2.296.07 2.572-1.065z
      "
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>

                  Pengaturan
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
                  className={`${isActive ? "text-[#0046FF]" : "text-gray-900"} transition`}
                />
                {item.name}
              </Link>
            );
          })}

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#0046FF]">
                <img src={avatarUrl} alt="Admin" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold">{session?.user?.name}</p>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
            </div>

            <Link href="/profile" onClick={() => setOpenMobile(false)} className="block py-3 hover:text-[#0046FF]">
              Profil Saya
            </Link>

            <Link href="/settings" onClick={() => setOpenMobile(false)} className="block py-3 hover:text-[#0046FF]">
              Pengaturan
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="block py-3 text-red-600 w-full text-left font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
