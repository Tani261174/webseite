import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/server/auth";
import { getAdminT } from "@/lib/server/admin-lang";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/brand/Brand";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const { a } = await getAdminT();
  return (
    <div className="bg-velvet flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl bg-ivory p-7 shadow-2xl">
          <h1 className="font-display text-2xl text-bordeaux">{a.login.title}</h1>
          {adminConfigured() ? (
            <LoginForm a={a.login} />
          ) : (
            <p className="mt-4 rounded-xl bg-gold/15 p-4 text-sm text-cocoa">{a.login.notConfigured}</p>
          )}
        </div>
      </div>
    </div>
  );
}
