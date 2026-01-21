"use client";
import { useState } from "react";
import { Menu, X, Home, Sparkles, Info, LogIn } from "lucide-react";

export default function NavbarLanding() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Fitur", href: "#fitur", icon: Sparkles },
    { name: "Tentang", href: "#tentang", icon: Info },
    { name: "Login", href: "/auth/login", icon: LogIn, button: true },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between">

        {/* LOGO + TITLE */}
        <div className="flex items-center gap-3">
          <img src="/logo-tb.png" className="w-10 h-10" alt="Logo" />
          <h1 className="text-xl font-bold text-[#0046FF] tracking-tight">
            E-BK STARBHAK
          </h1>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) =>
            item.button ? (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0046FF] to-[#6E8CFB] text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <item.icon size={20} />
                {item.name}
              </a>
            ) : (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-black font-medium hover:text-[#0046FF] transition group"
              >
                <item.icon
                  size={18}
                  className="text-black group-hover:text-[#0046FF] transition"
                />
                {item.name}
              </a>
            )
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#0046FF]"
        >
          {open ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white shadow-lg px-6 pb-6 pt-4 border-t border-gray-100">
          {menuItems.map((item) =>
            item.button ? (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center justify-center gap-3 mt-4 px-6 py-4 rounded-xl bg-gradient-to-r from-[#0046FF] to-[#6E8CFB] text-white font-bold text-lg shadow-lg hover:shadow-xl transition"
              >
                <item.icon size={22} />
                {item.name}
              </a>
            ) : (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-4 py-4 text-black font-medium hover:text-[#0046FF] transition"
              >
                <item.icon size={22} className="text-black" />
                {item.name}
              </a>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
