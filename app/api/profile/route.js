import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/database";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    const data = await query("SELECT id, name, email, role, avatar_url FROM users WHERE id = ?", [userId]);

    return Response.json({ user: data[0] });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const body = await req.json();

    const { name, email } = body;

    await query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, userId]
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const file = form.get("avatar");

    if (!file) return Response.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = Date.now() + "-" + file.name.replace(/\s/g, "_");

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const avatarUrl = "/uploads/" + fileName;

    await query("UPDATE users SET avatar_url = ? WHERE id = ?", [
      avatarUrl,
      session.user.id,
    ]);

    return Response.json({ avatar_url: avatarUrl });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
