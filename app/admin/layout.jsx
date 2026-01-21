import NavbarAdmin from "@/components/NavbarAdmin";

export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAdmin />
      <div className="pt-24 px-6">
        {children}
      </div>
    </div>
  );
}
