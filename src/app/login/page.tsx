import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171717] px-5 py-10">
      <section className="w-full max-w-md rounded-3xl bg-[#f7f4ef] p-7 shadow-2xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 font-display text-3xl text-white">
            B
          </div>

          <h1 className="font-display text-4xl text-neutral-900">
            Brownella
          </h1>

          <p className="mt-2 text-sm text-neutral-600">
            Administración del menú
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}