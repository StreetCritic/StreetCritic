import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";

import App from "@/components/app";

import { ColorSchemeScript } from "@mantine/core";

export const metadata: Metadata = {
  title: "StreetCritic",
  description: "We collect subjective data about traffic routes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <App>{children}</App>
      </body>
    </html>
  );
}
