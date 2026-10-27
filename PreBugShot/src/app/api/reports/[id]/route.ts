import { updateReport, type ReportStatus } from "@/lib/reports";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isReportStatus(value: unknown): value is ReportStatus {
  return value === "new" || value === "in-progress" || value === "resolved";
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/reports/[id]">,
) {
  let body: unknown;

  try {
    const text = await request.text();
    if (text.length > 10_000) {
      return Response.json({ error: "Dane są za duże." }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "Nie udało się odczytać danych." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return Response.json({ error: "Dane mają nieprawidłowy format." }, { status: 400 });
  }

  const status = body.status;
  const comment = body.comment;
  const validStatus = isReportStatus(status);

  if (
    (status !== undefined && !validStatus) ||
    (comment !== undefined &&
      (typeof comment !== "string" || comment.trim().length < 2 || comment.length > 1200)) ||
    (!validStatus && comment === undefined)
  ) {
    return Response.json({ error: "Sprawdź status lub treść komentarza." }, { status: 400 });
  }

  try {
    const { id } = await context.params;
    const report = await updateReport(id, {
      ...(validStatus ? { status } : {}),
      ...(typeof comment === "string" ? { comment } : {}),
    });

    if (!report) {
      return Response.json({ error: "Nie znaleziono zgłoszenia." }, { status: 404 });
    }

    return Response.json({ report });
  } catch (error) {
    console.error("Nie udało się zmienić zgłoszenia:", error);
    return Response.json(
      { error: "Nie udało się zmienić zgłoszenia." },
      { status: 500 },
    );
  }
}
