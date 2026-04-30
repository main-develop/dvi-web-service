import SettingsSidebar from "@/src/components/settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row rounded-md py-4">
          <SettingsSidebar />
          {children}
        </div>
      </div>
    </div>
  );
}
