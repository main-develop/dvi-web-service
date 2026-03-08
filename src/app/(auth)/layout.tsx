import "@/src/components/auth/auth.module.css";
import Header from "@/src/components/home/Header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="min-h-[530px] w-full max-w-sm p-8">{children}</div>
      </main>
    </>
  );
}
