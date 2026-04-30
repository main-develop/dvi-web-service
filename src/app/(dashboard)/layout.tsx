import { TooltipProvider } from "@/src/components/ui/tooltip";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import { DashboardSidebar } from "@/src/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";

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
        <DashboardSidebar />
        <main className="flex flex-1 flex-col px-6">
          <DashboardHeader />
          {children}
        </main>
      </TooltipProvider>
    </SidebarProvider>
  );
}
