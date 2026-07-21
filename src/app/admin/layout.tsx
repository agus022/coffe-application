import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminNavigation from "@/components/admin/admin-navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "ADMIN"
  ) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-100 lg:flex">
      <AdminNavigation
        userName={
          session.user.name ??
          session.user.email ??
          "Administrador"
        }
      />

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}