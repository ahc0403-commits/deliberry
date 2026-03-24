import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Deliberry",
  description: "Public Website",
  other: {
    "zalo-platform-site-verification": "PzwL3RVB91jirhL5xSPYRHv5q7VximKfCpav",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
