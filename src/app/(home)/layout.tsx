import "@/src/components/home/home.module.css";
import Header from "@/src/components/home/Header";
import Footer from "@/src/components/home/Footer";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
