"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bug, Camera, Check, CircleCheck, LoaderCircle, RotateCw, X } from "lucide-react";

type ScreenshotState = "idle" | "capturing" | "ready" | "error";

export default function BugReportWidget() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [screenshotState, setScreenshotState] = useState<ScreenshotState>("idle");
  const [screenshotError, setScreenshotError] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [preview, setPreview] = useState(false);
  const [retry, setRetry] = useState(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);
  const previewOpen = useRef(preview);
  const sendingRef = useRef(false);

  useEffect(() => {
    previewOpen.current = preview;
  }, [preview]);

  const close = useCallback(() => {
    if (sendingRef.current) return;
    setOpen(false);
    setPreview(false);
    setSent(false);
    setTitle("");
    setDescription("");
    setError("");
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim().length < 5) {
      setError("Tytuł powinien mieć co najmniej 5 znaków.");
      return;
    }
    if (description.trim().length < 12) {
      setError("Opis powinien mieć co najmniej 12 znaków.");
      return;
    }
    setError("");
    sendingRef.current = true;
    setIsSending(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          screenshot: screenshot || null,
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Nie udało się wysłać zgłoszenia.";
        setError(message);
        return;
      }

      setSent(true);
    } catch {
      setError("Nie udało się połączyć z serwerem. Spróbuj ponownie.");
    } finally {
      sendingRef.current = false;
      setIsSending(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    const triggerButton = trigger.current;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (previewOpen.current) setPreview(false);
        else close();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      triggerButton?.focus();
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    const timer = window.setTimeout(() => {
      setScreenshotState("capturing");
      void (async () => {
        try {
          await document.fonts.ready;
          const images = [...document.images].filter((image) => !image.closest("[data-bug-widget]"));
          images.forEach((image) => { image.loading = "eager"; });
          await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
          await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
          if (!active) return;

          const html2canvas = (await import("html2canvas")).default;
          const height = document.documentElement.scrollHeight;
          const canvas = await html2canvas(document.body, {
            backgroundColor: "#f8f8f5",
            height,
            logging: false,
            scale: Math.min(window.devicePixelRatio || 1, 1.5),
            scrollY: 0,
            useCORS: true,
            windowHeight: height,
            windowWidth: document.documentElement.clientWidth,
            onclone: (copy) => {
              copy
                .querySelectorAll("[data-bug-widget], .nextjs-portal, nextjs-portal, [data-nextjs-toast]")
                .forEach((element) => element.remove());
              const cloneWindow = copy.defaultView;
              if (cloneWindow) {
                copy.querySelectorAll<HTMLElement>("*").forEach((element) => {
                  const styles = cloneWindow.getComputedStyle(element);
                  for (let index = 0; index < styles.length; index += 1) {
                    const property = styles.item(index);
                    const value = styles.getPropertyValue(property);
                    if (!/\b(?:lab|lch|oklab|oklch)\(/i.test(value)) continue;

                    const fallback = property.includes("shadow")
                      ? "none"
                      : property.includes("color") && property.startsWith("background")
                        ? "#f5f5f4"
                        : property.includes("color")
                          ? "#44403c"
                          : "none";
                    element.style.setProperty(property, fallback, "important");
                  }
                });
              }
              copy
                .querySelectorAll<HTMLInputElement>(
                  'input[type="password"], input[type="email"], input[autocomplete*="password" i], input[autocomplete="username" i], input[name*="token" i], input[id*="token" i], input[name*="secret" i], input[id*="secret" i], input[name*="key" i], input[id*="key" i]',
                )
                .forEach((input) => {
                  const styles = cloneWindow?.getComputedStyle(input);
                  const replacement = copy.createElement("div");
                  replacement.textContent = "[ukryto]";
                  replacement.setAttribute("aria-label", "Ukryte dane");
                  replacement.style.cssText = [
                    `width: ${styles?.width ?? "100%"}`,
                    `height: ${styles?.height ?? "auto"}`,
                    `margin: ${styles?.margin ?? "0"}`,
                    `padding: ${styles?.padding ?? "8px 12px"}`,
                    `border: ${styles?.border ?? "1px solid #d6d3d1"}`,
                    `border-radius: ${styles?.borderRadius ?? "4px"}`,
                    `box-sizing: ${styles?.boxSizing ?? "border-box"}`,
                    `background: ${styles?.backgroundColor ?? "#ffffff"}`,
                    `color: #44403c`,
                    `font: ${styles?.font ?? "14px sans-serif"}`,
                    "display: flex",
                    "align-items: center",
                  ].join(";");
                  input.replaceWith(replacement);
                });
            },
          });
          if (!active) return;
          setScreenshot(canvas.toDataURL("image/jpeg", 0.75));
          setScreenshotState("ready");
        } catch (captureError) {
          if (active) {
            setScreenshotError(captureError instanceof Error ? captureError.message : "Nie udało się zrobić zrzutu.");
            setScreenshotState("error");
          }
        }
      })();
    }, 200);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [open, retry]);

  return (
    <div className="contents" data-bug-widget>
      <button
        ref={trigger}
        className="fixed bottom-5 right-5 z-10 flex items-center gap-2 rounded bg-green-800 px-4 py-3 text-sm text-white shadow hover:bg-green-700"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        type="button"
      >
        <Bug size={18} /> Zgłoś błąd
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 grid place-items-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <section
            ref={dialog}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded bg-white p-6 shadow-xl"
            aria-labelledby="report-title"
            aria-modal="true"
            role="dialog"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500">Formularz zgłoszenia</p>
                <h2 className="mt-2 font-serif text-2xl text-green-950" id="report-title">
                  {sent ? "Dziękujemy za zgłoszenie" : "Coś poszło nie tak?"}
                </h2>
              </div>
              <button className="rounded p-1 text-stone-500 hover:bg-stone-100 disabled:opacity-50" aria-label="Zamknij formularz" disabled={isSending} onClick={close} type="button">
                <X size={20} />
              </button>
            </div>

            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CircleCheck className="mb-3 text-green-700" size={40} />
                <p className="text-sm text-stone-700">Zgłoszenie zostało zapisane. Dzięki za pomoc!</p>
                <button className="mt-6 flex items-center gap-2 rounded bg-green-800 px-4 py-2 text-sm text-white" onClick={close} type="button">
                  <Check size={16} /> Gotowe
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={submit}>
                <label className="block text-sm text-stone-700">
                  Tytuł problemu
                  <input
                    className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm"
                    maxLength={120}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Np. Nie mogę dodać produktu do koszyka"
                    value={title}
                  />
                </label>
                <label className="block text-sm text-stone-700">
                  Opis problemu
                  <textarea
                    className="mt-1 min-h-28 w-full rounded border border-stone-300 px-3 py-2 text-sm"
                    maxLength={1200}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Co się wydarzyło? Co próbowałeś zrobić?"
                    value={description}
                  />
                  <span className="mt-1 flex justify-between text-xs text-stone-500">
                    <span>Minimum 12 znaków</span><span>{description.length}/1200</span>
                  </span>
                </label>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>Zrzut strony</span>
                    {screenshotState === "ready" && (
                      <button className="flex items-center gap-1 text-xs text-green-800" onClick={() => {
                        setScreenshot("");
                        setScreenshotError("");
                        setScreenshotState("capturing");
                        setRetry((value) => value + 1);
                      }} type="button">
                        <RotateCw size={14} /> Zrób ponownie
                      </button>
                    )}
                  </div>
                  {screenshotState === "ready" && screenshot ? (
                    <button
                      aria-label="Powiększ zrzut strony"
                      className="block w-full overflow-hidden rounded-lg border border-stone-300 bg-white text-left shadow-sm"
                      onClick={() => setPreview(true)}
                      type="button"
                    >
                      <span className="flex h-8 items-center gap-1.5 border-b border-stone-200 bg-stone-100 px-3">
                        <span className="h-2 w-2 rounded-full bg-stone-300" />
                        <span className="h-2 w-2 rounded-full bg-stone-300" />
                        <span className="h-2 w-2 rounded-full bg-stone-300" />
                        <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[10px] text-stone-500">
                          Zrzut strony · forma-studio.local
                        </span>
                      </span>
                      <span className="relative block aspect-video w-full bg-stone-200">
                        <Image alt="Podgląd zrzutu całej strony" className="object-contain" fill sizes="(max-width: 520px) 90vw, 450px" src={screenshot} unoptimized />
                      </span>
                      <span className="block border-t border-stone-200 px-3 py-1.5 text-center text-[11px] text-stone-500">
                        Kliknij, aby powiększyć
                      </span>
                    </button>
                  ) : (
                    <div className="flex min-h-20 items-center justify-center gap-2 rounded border bg-stone-100 px-3 text-center text-xs text-stone-600">
                      {screenshotState === "capturing" ? (
                        <><LoaderCircle className="animate-spin" size={16} /> Tworzenie zrzutu...</>
                      ) : screenshotState === "error" ? (
                        <div className="space-y-2">
                          <p className="text-red-700">Nie udało się zrobić zrzutu: {screenshotError}</p>
                          <button className="underline" onClick={() => {
                            setScreenshotError("");
                            setScreenshotState("capturing");
                            setRetry((value) => value + 1);
                          }} type="button">Spróbuj ponownie</button>
                        </div>
                      ) : (
                        <><Camera size={16} /> Zrzut pojawi się automatycznie</>
                      )}
                    </div>
                  )}
                </div>

                {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
                <div className="flex justify-end gap-2 border-t border-stone-200 pt-4">
                  <button className="rounded border border-stone-300 px-4 py-2 text-sm disabled:opacity-50" disabled={isSending} onClick={close} type="button">Anuluj</button>
                  <button className="rounded bg-green-800 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50" disabled={isSending} type="submit">
                    {isSending ? "Wysyłanie..." : "Wyślij zgłoszenie"}
                  </button>
                </div>
                <Link className="flex items-center justify-center gap-2 text-sm text-stone-600 hover:text-green-900" href="/admin">
                  Przejdź do panelu administratora <ArrowRight size={14} />
                </Link>
              </form>
            )}
          </section>
        </div>
      )}

      {preview && screenshot && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black p-5"
          onClick={(event) => {
            if (event.target === event.currentTarget) setPreview(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Podgląd zrzutu ekranu"
        >
          <button className="absolute right-4 top-4 z-10 rounded bg-white p-2" onClick={() => setPreview(false)} type="button" aria-label="Zamknij podgląd">
            <X size={20} />
          </button>
          <div className="relative h-[90vh] w-[92vw]">
            <Image alt="Pełny zrzut strony" className="pointer-events-none object-contain" fill sizes="92vw" src={screenshot} unoptimized />
          </div>
        </div>
      )}
    </div>
  );
}
