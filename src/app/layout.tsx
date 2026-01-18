import type { Metadata } from "next";
import "./globals.css";
import ddin from "./fonts";

export const metadata: Metadata = {
  title: "DVI",
  description: "Data Visualization Infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ddin.variable}>
      <body className="antialiased">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
