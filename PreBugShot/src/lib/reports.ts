import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export type ReportStatus = "new" | "in-progress" | "resolved";

export type ReportComment = {
  id: string;
  text: string;
  createdAt: string;
};

export type ReportHistoryEntry = {
  id: string;
  action: string;
  createdAt: string;
};

export type BugReport = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  screenshot: string | null;
  url: string;
  userAgent: string;
  status: ReportStatus;
  comments: ReportComment[];
  history: ReportHistoryEntry[];
};

const dataDirectory = join(process.cwd(), "data");
const reportsFile = join(dataDirectory, "bug-reports.json");

export function maskSensitiveText(text: string): string {
  return text
    .replace(
      /((?:password|passwd|has[lł]o|token|access[_ -]?token|api[_ -]?key|secret)\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi,
      "$1[ukryto]",
    )
    .replace(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi, "Bearer [ukryto]")
    .replace(
      /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
      "[ukryto token]",
    );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeReport(value: unknown): BugReport {
  if (!isRecord(value)) {
    throw new Error("Plik ze zgłoszeniami ma nieprawidłowy format.");
  }

  const status: ReportStatus =
    value.status === "in-progress" || value.status === "resolved"
      ? value.status
      : "new";
  const comments = Array.isArray(value.comments)
    ? value.comments.filter(
        (comment): comment is ReportComment =>
          isRecord(comment) &&
          typeof comment.id === "string" &&
          typeof comment.text === "string" &&
          typeof comment.createdAt === "string",
      )
    : [];
  const history = Array.isArray(value.history)
    ? value.history.filter(
        (entry): entry is ReportHistoryEntry =>
          isRecord(entry) &&
          typeof entry.id === "string" &&
          typeof entry.action === "string" &&
          typeof entry.createdAt === "string",
      )
    : [];

  if (
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.description !== "string" ||
    typeof value.createdAt !== "string"
  ) {
    throw new Error("Plik ze zgłoszeniami ma nieprawidłowy format.");
  }

  return {
    id: value.id,
    title: maskSensitiveText(value.title),
    description: maskSensitiveText(value.description),
    createdAt: value.createdAt,
    screenshot: typeof value.screenshot === "string" ? value.screenshot : null,
    url: typeof value.url === "string" ? value.url : "",
    userAgent: typeof value.userAgent === "string" ? value.userAgent : "",
    status,
    comments: comments.map((comment) => ({
      ...comment,
      text: maskSensitiveText(comment.text),
    })),
    history,
  };
}

export async function getReports(): Promise<BugReport[]> {
  try {
    const contents = await readFile(reportsFile, "utf8");
    const reports: unknown = JSON.parse(contents);

    if (!Array.isArray(reports)) {
      throw new Error("Plik ze zgłoszeniami ma nieprawidłowy format.");
    }

    return reports.map(normalizeReport);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function saveReports(reports: BugReport[]): Promise<void> {
  const temporaryFile = `${reportsFile}.${randomUUID()}.tmp`;
  await mkdir(dataDirectory, { recursive: true });

  try {
    await writeFile(temporaryFile, JSON.stringify(reports, null, 2), "utf8");
    await rename(temporaryFile, reportsFile);
  } catch (error) {
    await rm(temporaryFile, { force: true });
    throw error;
  }
}

export async function addReport(
  report: Pick<BugReport, "title" | "description" | "screenshot" | "url" | "userAgent">,
): Promise<BugReport> {
  const reports = await getReports();
  const now = new Date().toISOString();
  const newReport: BugReport = {
    ...report,
    title: maskSensitiveText(report.title),
    description: maskSensitiveText(report.description),
    id: randomUUID(),
    createdAt: now,
    url: report.url.slice(0, 2048),
    userAgent: report.userAgent.slice(0, 512),
    status: "new",
    comments: [],
    history: [{ id: randomUUID(), action: "Dodano zgłoszenie", createdAt: now }],
  };

  await saveReports([newReport, ...reports]);
  return newReport;
}

export async function updateReport(
  id: string,
  update: { status?: ReportStatus; comment?: string },
): Promise<BugReport | null> {
  const reports = await getReports();
  const report = reports.find((item) => item.id === id);
  if (!report) return null;

  const now = new Date().toISOString();

  if (update.status && update.status !== report.status) {
    const labels: Record<ReportStatus, string> = {
      new: "Nowe",
      "in-progress": "W trakcie",
      resolved: "Rozwiązane",
    };
    report.history.unshift({
      id: randomUUID(),
      action: `Zmieniono status: ${labels[report.status]} → ${labels[update.status]}`,
      createdAt: now,
    });
    report.status = update.status;
  }

  if (update.comment) {
    const text = maskSensitiveText(update.comment.trim());
    report.comments.unshift({ id: randomUUID(), text, createdAt: now });
    report.history.unshift({
      id: randomUUID(),
      action: "Dodano komentarz",
      createdAt: now,
    });
  }

  await saveReports(reports);
  return report;
}
