"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const res = await signIn("credentials", {
            redirect: false,
            identifier,
            password,
        });

        setLoading(false);

        if (!res || res.error) {
            toast.error("Identifier atau password salah!");
            return;
        }

        toast.success("Login berhasil!");

        // Ambil session untuk role
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();

        const role = session?.user?.role;

        switch (role) {
            case "admin":
                window.location.href = "/admin/dashboard";
                break;
            case "guru":
                window.location.href = "/gurubk/home";
                break;
            case "siswa":
                window.location.href = "/siswa/home";
                break;
            default:
                toast.error("Role tidak dikenali!");
                break;
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
            <div className="bg-white p-10 rounded-2xl w-full max-w-md shadow">

                {/* BACK BUTTON */}
                <button
                    onClick={() => (window.location.href = "/")}
                    className="flex items-center gap-2 text-[#0046FF] mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Kembali</span>
                </button>

                {/* LOGO */}
                <div className="flex justify-center mb-4">
                    <img src="/logo-tb.png" className="w-20" />
                </div>

                <h2 className="text-xl font-bold text-center text-[#0046FF] mb-6">
                    Silakan Login Terlebih Dahulu
                </h2>

                <form onSubmit={handleSubmit}>
                    <label className="text-gray-800 font-semibold">Masukkann Username</label>
                    <input
                        type="text"
                        placeholder="Masukkan username"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full border p-3 rounded mt-1 mb-4 text-black"
                        required
                    />

                    <label className="text-gray-800 font-semibold">Password</label>
                    <input
                        type="password"
                        placeholder="Masukkan Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-3 rounded mt-1 mb-6 text-black"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#6E8CFB] text-white py-3 rounded-lg font-semibold"
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>
            </div>
        </div>
    );
}

