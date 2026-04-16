import { AppShell } from "@/components/echo/AppShell";
import { SearchScreen } from "@/components/echo/screens/SearchScreen";

export default function Page() {
  return (
    <AppShell activeNav="search" showSearch={false} showArrows>
      <SearchScreen />
    </AppShell>
  );
}
