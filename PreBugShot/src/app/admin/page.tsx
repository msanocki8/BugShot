"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (username === "admin" && password === "admin") {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Nieprawidłowy nick lub hasło.");
    }
  }

  return (
    <main className="min-h-screen px-5 py-8">
      <div className="mx-auto max-w-4xl">
        <Link className="flex w-fit items-center gap-2 text-sm text-stone-600 hover:text-green-900" href="/">
          <ArrowLeft size={16} /> Wróć do strony
        </Link>

        {!loggedIn ? (
          <section className="mx-auto mt-20 max-w-sm rounded border border-stone-200 bg-white p-7">
            <ShieldCheck className="mb-4 text-green-800" size={24} />
            <p className="text-xs uppercase tracking-widest text-stone-500">Forma Studio</p>
            <h1 className="mt-2 font-serif text-3xl text-green-950">Panel administratora</h1>
            <p className="my-4 text-sm text-stone-600">Zaloguj się, aby przejść do panelu.</p>
            <form className="space-y-4" onSubmit={login}>
              <label className="block text-sm text-stone-700">
                Nick
                <input
                  className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  value={username}
                />
              </label>
              <label className="block text-sm text-stone-700">
                Hasło
                <input
                  className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </label>
              {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
              <button className="w-full rounded bg-green-900 px-4 py-2 text-sm text-white hover:bg-green-800" type="submit">
                Zaloguj się
              </button>
            </form>
            <p className="mt-4 text-xs text-stone-500">Do prezentacji wpisz: admin / admin</p>
          </section>
        ) : (
          <section className="mt-12 rounded border border-stone-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl text-green-950">Panel administratora</h1>
                <p className="mt-2 text-sm text-stone-600">To jest podgląd panelu. Zgłoszenia nie są jeszcze zapisywane.</p>
              </div>
              <button className="flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm text-stone-700" onClick={() => setLoggedIn(false)} type="button">
                <LogOut size={16} /> Wyloguj
              </button>
            </div>
            <p className="mt-6 rounded bg-stone-100 p-4 text-sm text-stone-600">Brak zgłoszeń do wyświetlenia.</p>
          </section>
        )}
      </div>
    </main>
  );
}
