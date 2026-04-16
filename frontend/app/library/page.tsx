import { AppShell } from "@/components/echo/AppShell";
import { LibraryScreen } from "@/components/echo/screens/LibraryScreen";
import { fetchBackendTracks, mapTracksToArtwork } from "@/lib/backend-api";

export default async function Page() {
  const { connected, tracks } = await fetchBackendTracks();
  const backendUploads = mapTracksToArtwork(tracks, 8);

  return (
    <AppShell activeNav="library" searchPlaceholder="Search library">
      <LibraryScreen backendUploads={backendUploads} backendConnected={connected} />
    </AppShell>
  );
}
