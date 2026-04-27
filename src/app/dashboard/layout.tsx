import { TooltipProvider } from "@/src/components/ui/tooltip";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/ui/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "14rem",
          "--sidebar-width-mobile": "12rem",
        } as React.CSSProperties
      }
    >
      <TooltipProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col">{children}</main>
      </TooltipProvider>
    </SidebarProvider>
  );
}
