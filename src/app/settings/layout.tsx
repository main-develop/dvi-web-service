import { TooltipProvider } from "@/src/components/ui/tooltip";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import { SettingsSidebar } from "@/src/components/settings/SettingsSidebar";

export default function SettingsLayout({
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
        <SettingsSidebar />
        <main className="flex flex-1 flex-col">{children}</main>
      </TooltipProvider>
    </SidebarProvider>
  );
}
