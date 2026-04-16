import { AppShell } from "@/components/echo/AppShell";
import { HomeScreen } from "@/components/echo/screens/HomeScreen";

export default function Page() {
  return (
    <AppShell activeNav="home" searchPlaceholder="Search for artists, tracks, or podcasts">
      <HomeScreen />
    </AppShell>
  );
}
