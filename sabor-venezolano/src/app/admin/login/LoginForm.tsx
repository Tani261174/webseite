"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import type { AdminMessages } from "@/lib/i18n/admin";

export function LoginForm({ a }: { a: AdminMessages["login"] }) {
  const [state, action, pending] = useActionState(loginAction, null);
  const error = state?.error ? (a as Record<string, string>)[state.error] : null;
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="user" className="mb-1.5 block text-sm font-bold">{a.user}</label>
        <input id="user" name="user" className="field" autoComplete="username" required defaultValue={state?.user ?? ""} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-bold">{a.password}</label>
        <input id="password" name="password" type="password" className="field" autoComplete="current-password" required />
      </div>
      {error ? <p role="alert" className="rounded-md bg-danger/10 p-3 text-sm font-semibold text-danger">{error}</p> : null}
      <button className="btn btn-primary w-full" disabled={pending}>
        {a.submit}
      </button>
    </form>
  );
}
