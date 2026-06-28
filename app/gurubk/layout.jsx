import SidebarGuru from "@/components/SidebarGuru";

export const metadata = {
  title: "Guru BK Panel",
};

export default function GuruLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarGuru />
      <div className="lg:ml-64">
        {children}
      </div>
    </div>
  );
}
