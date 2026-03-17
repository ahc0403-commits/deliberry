import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Deliberry Admin Console",
  description: "Admin Console",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
