import type { Metadata } from "next";
import "./globals.css";
import ddin from "./fonts";
import { SmoothScrollProvider } from "../components/ui/smooth-scroll-provider";

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
      <body className="dark flex min-h-screen flex-col antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
