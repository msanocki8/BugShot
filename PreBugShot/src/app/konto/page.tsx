"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";
import BugReportWidget from "@/components/widget/BugReportWidget";

export default function AccountPage() {
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("To jest przykładowa strona. Logowanie nie wysyła ani nie zapisuje danych.");
  }

  return (
    <main className="min-h-screen px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <Link className="flex w-fit items-center gap-2 text-sm text-stone-600 hover:text-green-900" href="/">
          <ArrowLeft size={16} /> Wróć do sklepu
        </Link>

        <section className="mx-auto mt-16 max-w-md rounded border border-stone-200 bg-white p-7">
          <UserRound className="mb-4 text-green-800" size={24} />
          <p className="text-xs uppercase tracking-widest text-stone-500">Forma Studio</p>
          <h1 className="mt-2 font-serif text-3xl text-green-950">Moje konto</h1>
          <p className="my-4 text-sm leading-6 text-stone-600">
            Zaloguj się, aby zobaczyć swoje zamówienia.
          </p>

          <form className="space-y-4" onSubmit={submit}>
            <label className="block text-sm text-stone-700">
              Adres e-mail
              <input
                autoComplete="username"
                className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
                name="email"
                placeholder="jan@example.com"
                required
                type="email"
              />
            </label>
            <label className="block text-sm text-stone-700">
              Hasło
              <input
                autoComplete="current-password"
                className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
                name="password"
                placeholder="Wpisz hasło"
                required
                type="password"
              />
            </label>
            <button className="w-full rounded bg-green-900 px-4 py-2.5 text-sm text-white hover:bg-green-800" type="submit">
              Zaloguj się
            </button>
            {message && <p className="text-sm text-stone-600" role="status">{message}</p>}
          </form>

        </section>
      </div>
      <BugReportWidget />
    </main>
  );
}
