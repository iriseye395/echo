import { AppShell } from "@/components/echo/AppShell";
import { RoomScreen } from "@/components/echo/screens/RoomScreen";

export default function Page() {
  return (
    <AppShell activeNav="rooms" showSearch={false}>
      <RoomScreen />
    </AppShell>
  );
}
