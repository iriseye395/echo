import { AppShell } from "@/components/echo/AppShell";
import { HomeScreen } from "@/components/echo/screens/HomeScreen";
import { fetchBackendTracks, mapTracksToArtwork } from "@/lib/backend-api";

export default async function Page() {
  const { connected, tracks } = await fetchBackendTracks();
  const backendRecentItems = mapTracksToArtwork(tracks, 6);

  return (
    <AppShell activeNav="home" searchPlaceholder="Search for artists, tracks, or podcasts">
      <HomeScreen backendRecentItems={backendRecentItems} backendConnected={connected} />
    </AppShell>
  );
}
