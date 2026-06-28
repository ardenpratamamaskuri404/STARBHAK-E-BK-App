import SidebarAdmin from "@/components/SidebarAdmin";

export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarAdmin />
      <div className="lg:ml-64">
        {children}
      </div>
    </div>
  );
}
