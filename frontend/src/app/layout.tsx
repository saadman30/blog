import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.scss";
import RootLayoutShell from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minimalist Blog & Portfolio",
  description: "A world-class minimalist blog and portfolio built with Next.js."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootLayoutShell>{children}</RootLayoutShell>
      </body>
    </html>
  );
}

