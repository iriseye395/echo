import { AppShell } from "@/components/echo/AppShell";
import { PlayerScreen } from "@/components/echo/screens/PlayerScreen";

export default function Page() {
  return (
    <AppShell activeNav="home" showSearch={false} showArrows showPlayer={false}>
      <PlayerScreen />
    </AppShell>
  );
}
