import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
    "/",
    "/auth/login",
    "/auth/register",
    "/api/auth",
];

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // izinkan halaman public
    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const role = token.role;

    // proteksi halaman admin
    if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // proteksi halaman guru
    if (pathname.startsWith("/guru") && role !== "guru") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // proteksi halaman siswa
    if (pathname.startsWith("/siswa") && role !== "siswa") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/guru/:path*",
        "/siswa/:path*",
        "/auth/:path*",
    ],
};
