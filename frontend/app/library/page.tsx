import { AppShell } from "@/components/echo/AppShell";
import { LibraryScreen } from "@/components/echo/screens/LibraryScreen";

export default function Page() {
  return (
    <AppShell activeNav="library" searchPlaceholder="Search library">
      <LibraryScreen />
    </AppShell>
  );
}
