import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forma Studio — przedmioty do domu",
  description: "Przedmioty do domu wybierane spokojnie i na dłużej.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
