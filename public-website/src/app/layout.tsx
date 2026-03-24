import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Deliberry",
  description: "Public Website",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="zalo-platform-site-verification"
          content="PzwL3RVB91jirhL5xSPYRHv5q7VximKfCpav"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
