"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, LogOut, ShieldCheck } from "lucide-react";
import type { BugReport, ReportStatus } from "@/lib/reports";

const statuses: { value: ReportStatus; label: string }[] = [
  { value: "new", label: "Nowe" },
  { value: "in-progress", label: "W trakcie" },
  { value: "resolved", label: "Rozwiązane" },
];
const statusFilters = [{ value: "all", label: "Wszystkie" }, ...statuses] as const;
const inputClass = "mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm";

function isStatus(value: unknown): value is ReportStatus {
  return value === "new" || value === "in-progress" || value === "resolved";
}

function isReport(value: unknown): value is BugReport {
  if (typeof value !== "object" || value === null) return false;
  const report = value as Record<string, unknown>;
  return typeof report.id === "string" && typeof report.title === "string" &&
    typeof report.description === "string" && typeof report.createdAt === "string" &&
    typeof report.url === "string" && typeof report.userAgent === "string" &&
    isStatus(report.status) && Array.isArray(report.comments) &&
    Array.isArray(report.history) &&
    (typeof report.screenshot === "string" || report.screenshot === null);
}

function errorText(data: unknown, fallback: string) {
  return typeof data === "object" && data !== null && "error" in data &&
    typeof data.error === "string" ? data.error : fallback;
}

function StatusMark({ status }: { status: ReportStatus }) {
  if (status === "new") return <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-500" />;
  if (status === "in-progress") return <Clock3 aria-hidden="true" className="text-amber-500" size={14} />;
  return <CheckCircle2 aria-hidden="true" className="text-green-600" size={14} />;
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [values, setValues] = useState({ nick: "", password: "" });
  const [error, setError] = useState("");
  const fields = [
    { key: "nick" as const, label: "Nick", type: "text" },
    { key: "password" as const, label: "Hasło", type: "password" },
  ];

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (values.nick !== "admin" || values.password !== "admin") {
      setError("Nieprawidłowy nick lub hasło.");
      return;
    }
    setError("");
    onLogin();
  }

  return (
    <section className="mx-auto mt-20 max-w-sm rounded border border-stone-200 bg-white p-7">
      <ShieldCheck className="mb-4 text-green-800" size={24} />
      <p className="text-xs uppercase tracking-widest text-stone-500">Forma Studio</p>
      <h1 className="mt-2 font-serif text-3xl text-green-950">Panel administratora</h1>
      <p className="my-4 text-sm text-stone-600">Zaloguj się, aby przejść do panelu.</p>
      <form className="space-y-4" onSubmit={submit}>
        {fields.map(({ key, label, type }) => (
          <label className="block text-sm text-stone-700" key={key}>
            {label}
            <input
              className={inputClass}
              onChange={(event) => setValues({ ...values, [key]: event.target.value })}
              required type={type} value={values[key]}
            />
          </label>
        ))}
        {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
        <button className="w-full rounded bg-green-900 px-4 py-2 text-sm text-white hover:bg-green-800" type="submit">Zaloguj się</button>
      </form>
      <p className="mt-4 text-xs text-stone-500">Do prezentacji wpisz: admin / admin</p>
    </section>
  );
}

function ReportDetails({
  report, saving, comment, onStatus, onComment, onCommentChange,
}: {
  report: BugReport;
  saving: boolean;
  comment: string;
  onStatus: (status: ReportStatus) => void;
  onComment: (text: string) => void;
  onCommentChange: (text: string) => void;
}) {
  const technicalInfo = [
    { label: "Strona", value: report.url },
    { label: "Przeglądarka", value: report.userAgent },
  ].filter((item) => item.value);

  return (
    <article className="min-w-0 rounded border border-stone-200 p-4">
      <h2 className="font-serif text-2xl text-green-950">{report.title}</h2>
      <p className="mt-2 text-xs text-stone-500">Dodano: {new Date(report.createdAt).toLocaleString("pl-PL")}</p>
      <label className="mt-4 block text-sm text-stone-700">
        Status
        <select className={inputClass} disabled={saving} onChange={(event) => {
          if (isStatus(event.target.value)) onStatus(event.target.value);
        }} value={report.status}>
          {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
        </select>
      </label>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-stone-700">{report.description}</p>

      <section className="mt-5 border-t border-stone-200 pt-4">
        <h3 className="text-sm font-medium text-stone-800">Komentarze</h3>
        <form className="mt-3 space-y-2" onSubmit={(event) => {
          event.preventDefault();
          if (comment.trim().length >= 2) onComment(comment);
        }}>
          <textarea className="min-h-20 w-full rounded border border-stone-300 px-3 py-2 text-sm"
            maxLength={1200} onChange={(event) => onCommentChange(event.target.value)}
            placeholder="Dodaj komentarz" value={comment} />
          <button className="rounded bg-green-800 px-3 py-2 text-sm text-white disabled:opacity-50"
            disabled={saving || comment.trim().length < 2} type="submit">Dodaj komentarz</button>
        </form>
        {report.comments.length ? report.comments.map((item) => (
          <p className="mt-3 rounded bg-stone-100 p-3 text-sm text-stone-700" key={item.id}>
            {item.text}<time className="mt-1 block text-xs text-stone-500">{new Date(item.createdAt).toLocaleString("pl-PL")}</time>
          </p>
        )) : <p className="mt-3 text-sm text-stone-500">Nie dodano jeszcze komentarzy.</p>}
      </section>

      <details className="mt-5 border-t border-stone-200 pt-4">
        <summary className="cursor-pointer text-sm font-medium text-stone-800">Historia zmian ({report.history.length})</summary>
        {report.history.map((item) => (
          <p className="mt-2 text-sm text-stone-600" key={item.id}>
            {item.action} <time className="text-xs text-stone-500">{new Date(item.createdAt).toLocaleString("pl-PL")}</time>
          </p>
        ))}
      </details>

      {technicalInfo.length > 0 && (
        <details className="mt-5 border-t border-stone-200 pt-4">
          <summary className="cursor-pointer text-sm font-medium text-stone-800">Informacje techniczne</summary>
          {technicalInfo.map((item) => <p className="mt-2 break-all text-xs text-stone-600" key={item.label}>{item.label}: {item.value}</p>)}
        </details>
      )}

      {report.screenshot ? (
        <div className="mt-5 overflow-auto rounded border border-stone-200 bg-stone-100">
          <Image alt="Zrzut strony dołączony do zgłoszenia" className="h-auto max-h-[60vh] w-full object-contain"
            height={800} src={report.screenshot} unoptimized width={1200} />
        </div>
      ) : <p className="mt-5 rounded bg-stone-100 p-3 text-sm text-stone-600">Do zgłoszenia nie dołączono zrzutu ekranu.</p>}
    </article>
  );
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [reports, setReports] = useState<BugReport[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [comment, setComment] = useState("");

  async function loadReports() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/reports", { cache: "no-store" });
      const data: unknown = await response.json();
      if (!response.ok) throw new Error(errorText(data, "Nie udało się wczytać zgłoszeń."));
      if (typeof data !== "object" || data === null || !("reports" in data) ||
        !Array.isArray(data.reports) || !data.reports.every(isReport)) {
        throw new Error("Serwer zwrócił nieprawidłowe dane.");
      }
      const list = data.reports.filter(isReport);
      setReports(list);
      setSelectedId((id) => list.some((item) => item.id === id) ? id : list[0]?.id ?? null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się wczytać zgłoszeń.");
    } finally {
      setLoading(false);
    }
  }

  async function updateReport(update: { status?: ReportStatus; comment?: string }) {
    const selected = filteredReports.find((item) => item.id === selectedId) ?? filteredReports[0];
    if (!selected) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/reports/${selected.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(update),
      });
      const data: unknown = await response.json();
      if (!response.ok) throw new Error(errorText(data, "Nie udało się zaktualizować zgłoszenia."));
      if (typeof data !== "object" || data === null || !("report" in data) || !isReport(data.report)) {
        throw new Error("Serwer zwrócił nieprawidłowe dane.");
      }
      const changed = data.report;
      setReports((items) => items.map((item) => item.id === changed.id ? changed : item));
      setComment("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się zaktualizować zgłoszenia.");
    } finally {
      setSaving(false);
    }
  }

  const query = search.trim().toLocaleLowerCase("pl");
  const searchResults = reports.filter((report) => {
    const text = `${report.title} ${report.description}`.toLocaleLowerCase("pl");
    const date = report.createdAt.slice(0, 10);
    return (!query || text.includes(query)) && (!dateFrom || date >= dateFrom) && (!dateTo || date <= dateTo);
  });
  const filteredReports = searchResults.filter((item) => statusFilter === "all" || item.status === statusFilter);
  const selectedReport = filteredReports.find((item) => item.id === selectedId) ?? filteredReports[0];
  const filters = [
    { label: "Szukaj", value: search, change: setSearch, type: "text", placeholder: "Tytuł lub opis" },
    { label: "Od daty", value: dateFrom, change: setDateFrom, type: "date" },
    { label: "Do daty", value: dateTo, change: setDateTo, type: "date" },
  ];

  return (
    <main className="min-h-screen px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <Link className="flex w-fit items-center gap-2 text-sm text-stone-600 hover:text-green-900" href="/">
          <ArrowLeft size={16} /> Wróć do strony
        </Link>
        {!loggedIn ? <LoginForm onLogin={async () => { setLoggedIn(true); await loadReports(); }} /> : (
          <section className="mt-12 rounded border border-stone-200 bg-white p-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl text-green-950">Panel administratora</h1>
                <p className="mt-2 text-sm text-stone-600">Zgłoszenia są zapisywane lokalnie na tym komputerze.</p>
              </div>
              <button className="flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm text-stone-700"
                onClick={() => { setLoggedIn(false); setReports([]); setSelectedId(null); }} type="button">
                <LogOut size={16} /> Wyloguj
              </button>
            </header>

            {loading ? <p className="mt-6 rounded bg-stone-100 p-4 text-sm text-stone-600">Wczytywanie zgłoszeń...</p>
              : message ? <div className="mt-6 rounded bg-red-50 p-4 text-sm text-red-700">
                {message}<button className="ml-2 underline" onClick={() => void loadReports()} type="button">Spróbuj ponownie</button>
              </div>
              : !reports.length ? <p className="mt-6 rounded bg-stone-100 p-4 text-sm text-stone-600">Brak zgłoszeń.</p>
                : <>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filters.map((filter) => (
                      <label className="text-xs text-stone-600" key={filter.label}>
                        {filter.label}
                        <input className={inputClass} onChange={(event) => filter.change(event.target.value)}
                          placeholder={filter.placeholder} type={filter.type} value={filter.value} />
                      </label>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                    <section aria-label="Lista zgłoszeń" className="space-y-2">
                      <h2 className="text-sm font-medium text-stone-700">Zgłoszenia ({filteredReports.length})</h2>
                      <div aria-label="Filtruj zgłoszenia po statusie" className="mb-4 flex flex-wrap gap-2">
                        {statusFilters.map((status) => {
                          const count = status.value === "all" ? searchResults.length
                            : searchResults.filter((item) => item.status === status.value).length;
                          return (
                            <button aria-pressed={statusFilter === status.value}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${
                                statusFilter === status.value ? "border-green-800 bg-green-50 font-medium text-green-950"
                                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                              }`}
                              key={status.value} onClick={() => setStatusFilter(status.value)} type="button">
                              {status.value !== "all" && <StatusMark status={status.value} />}
                              {status.label} <span className="text-stone-500">{count}</span>
                            </button>
                          );
                        })}
                      </div>
                      {!filteredReports.length ? <p className="rounded bg-stone-100 p-4 text-sm text-stone-600">Brak zgłoszeń pasujących do filtrów.</p>
                        : filteredReports.map((report) => (
                          <button aria-pressed={selectedReport?.id === report.id}
                            className={`block w-full rounded border p-3 text-left ${
                              selectedReport?.id === report.id ? "border-green-800 bg-green-50" : "border-stone-200 hover:bg-stone-50"
                            }`}
                            key={report.id} onClick={() => setSelectedId(report.id)} type="button">
                            <span className="block font-medium text-green-950">{report.title}</span>
                            <span className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
                              <StatusMark status={report.status} />{statuses.find((item) => item.value === report.status)?.label}
                              · {new Date(report.createdAt).toLocaleString("pl-PL")}
                            </span>
                          </button>
                        ))}
                    </section>
                    {selectedReport && <ReportDetails report={selectedReport} saving={saving} comment={comment}
                      onStatus={(status) => void updateReport({ status })}
                      onComment={(text) => void updateReport({ comment: text })} onCommentChange={setComment} />}
                  </div>
                </>}
          </section>
        )}
      </div>
    </main>
  );
}
