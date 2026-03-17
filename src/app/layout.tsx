import type { Metadata } from "next";
import "./globals.css";
import ddin from "./fonts";
import { SmoothScrollProvider } from "../components/ui/smooth-scroll-provider";
import { Toaster } from "../components/ui/sonner";

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
        <Toaster />
      </body>
    </html>
  );
}
