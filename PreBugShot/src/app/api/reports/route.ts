import { addReport, getReports } from "@/lib/reports";

const maxRequestSize = 6 * 1024 * 1024;
const maxScreenshotSize = 5 * 1024 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function GET() {
  try {
    const reports = await getReports();
    return Response.json(
      { reports },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Nie udało się odczytać zgłoszeń:", error);
    return Response.json(
      { error: "Nie udało się wczytać zgłoszeń." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));

  if (contentLength > maxRequestSize) {
    return Response.json(
      { error: "Zrzut jest za duży. Spróbuj wysłać zgłoszenie bez niego." },
      { status: 413 },
    );
  }

  let body: unknown;

  try {
    const text = await request.text();
    if (text.length > maxRequestSize) {
      return Response.json(
        { error: "Zrzut jest za duży. Spróbuj wysłać zgłoszenie bez niego." },
        { status: 413 },
      );
    }
    body = JSON.parse(text);
  } catch {
    return Response.json(
      { error: "Nie udało się odczytać formularza." },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return Response.json({ error: "Formularz ma nieprawidłowe dane." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const screenshot =
    typeof body.screenshot === "string" ? body.screenshot : null;
  const rawUrl = typeof body.url === "string" ? body.url : "";
  const userAgent = typeof body.userAgent === "string" ? body.userAgent : "";

  if (title.length < 5 || title.length > 120) {
    return Response.json(
      { error: "Tytuł powinien mieć od 5 do 120 znaków." },
      { status: 400 },
    );
  }

  if (description.length < 12 || description.length > 1200) {
    return Response.json(
      { error: "Opis powinien mieć od 12 do 1200 znaków." },
      { status: 400 },
    );
  }

  if (
    screenshot !== null &&
    (!screenshot.startsWith("data:image/jpeg;base64,") ||
      screenshot.length > maxScreenshotSize)
  ) {
    return Response.json(
      { error: "Zrzut jest za duży lub ma nieprawidłowy format." },
      { status: 400 },
    );
  }

  let url = "";
  if (rawUrl) {
    try {
      const parsedUrl = new URL(rawUrl);
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        url = `${parsedUrl.origin}${parsedUrl.pathname}`.slice(0, 2048);
      }
    } catch {
      return Response.json({ error: "Adres strony jest nieprawidłowy." }, { status: 400 });
    }
  }

  try {
    const report = await addReport({
      title,
      description,
      screenshot,
      url,
      userAgent: userAgent.slice(0, 512),
    });
    return Response.json({ report }, { status: 201 });
  } catch (error) {
    console.error("Nie udało się zapisać zgłoszenia:", error);
    return Response.json(
      { error: "Nie udało się zapisać zgłoszenia." },
      { status: 500 },
    );
  }
}
