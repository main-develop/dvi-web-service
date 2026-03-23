import type { Metadata } from "next";
import "./globals.css";
import ddin from "./fonts";
import { SmoothScrollProvider } from "../components/ui/smooth-scroll-provider";
import { Toaster } from "../components/ui/sonner";
import { AuthProvider } from "../context/AuthContext";

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
        <AuthProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
