import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="admin" />
      <main className="flex-1  overflow-auto">{children}</main>
    </div>
  );
}
