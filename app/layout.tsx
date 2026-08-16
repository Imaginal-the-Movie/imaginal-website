import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Imaginal — A Film",
  description: "Imaginal — a film in development.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
