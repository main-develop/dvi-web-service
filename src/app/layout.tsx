import type { Metadata } from "next";
import "./globals.css";
import ddin from "./fonts";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SmoothScrollProvider } from "../components/SmoothScrollProvider";

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
      <body className="dark antialiased flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col">
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
