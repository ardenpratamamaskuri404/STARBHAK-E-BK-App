"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  UserCheck,
  Calendar,
  FileText,
  LogOut,
  UserCircle,
  Settings,
  Menu,
  X,
  ChevronLeft,
  Bell,
} from "lucide-react";

export default function SidebarAdmin() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Manajemen Siswa", href: "/admin/siswa", icon: Users },
    { name: "Manajemen Guru", href: "/admin/guru", icon: UserCheck },
    { name: "Jadwal Konseling", href: "/admin/jadwal", icon: Calendar },
    { name: "Laporan", href: "/admin/laporan", icon: FileText },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarUrl =
    session?.user?.avatar_url?.startsWith("/uploads/")
      ? session.user.avatar_url
      : "/images/avatar-default.png";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo Header */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} p-4 border-b border-gray-100`}>
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <img src="/logo-tb.png" className="w-9 h-9" alt="Logo" />
            <span className="text-lg font-bold text-[#0046FF]">Admin E-BK</span>
          </Link>
        )}
        {collapsed && (
          <img src="/logo-tb.png" className="w-9 h-9" alt="Logo" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 text-gray-500 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive
                  ? "bg-[#0046FF] text-white shadow-md shadow-blue-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
                ${collapsed ? "justify-center" : ""}
              `}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`} />
              {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className={`p-3 border-t border-gray-100 ${collapsed ? "flex flex-col items-center" : ""}`}>
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#0046FF] flex-shrink-0">
              <img src={avatarUrl} alt="Admin" className="w-full h-full object-cover" />
            </div>
            {!collapsed && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{session?.user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            )}
          </button>

          <AnimatePresence>
            {profileOpen && !collapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-[#0046FF] to-blue-600 text-white">
                  <p className="font-bold">{session?.user?.name}</p>
                  <p className="text-sm opacity-90">Administrator E-BK</p>
                </div>
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition" onClick={() => setProfileOpen(false)}>
                  <UserCircle className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Profil Saya</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-t" onClick={() => setProfileOpen(false)}>
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Pengaturan</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition border-t"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 z-50"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
                <SidebarContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
        <SidebarContent />
      </aside>
    </>
  );
}
