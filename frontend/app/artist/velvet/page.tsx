import { AppShell } from "@/components/echo/AppShell";
import { ArtistScreen } from "@/components/echo/screens/ArtistScreen";

export default function Page() {
  return (
    <AppShell activeNav="home" showSearch={false}>
      <ArtistScreen />
    </AppShell>
  );
}
