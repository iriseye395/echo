import { NextResponse } from "next/server";
import { fetchBackendTrackPlayback } from "@/lib/backend-api";

const PUBLIC_BLOB_ORIGIN = process.env.NEXT_PUBLIC_BLOB_ORIGIN || "http://127.0.0.1:10000";

function normalizePlaybackUrl(rawUrl: string): string {
  try {
    const source = new URL(rawUrl);
    const publicOrigin = new URL(PUBLIC_BLOB_ORIGIN);

    if (source.hostname === "azurite") {
      source.protocol = publicOrigin.protocol;
      source.hostname = publicOrigin.hostname;
      source.port = publicOrigin.port;
    }

    source.pathname = source.pathname.replace(/\/{2,}/g, "/");
    return source.toString();
  } catch {
    return rawUrl;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackId: string }> },
) {
  const { trackId } = await params;
  const result = await fetchBackendTrackPlayback(trackId);

  if (!result.connected || !result.playback) {
    return NextResponse.json(
      { detail: "Unable to fetch playback URL" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    track_id: result.playback.track_id,
    hls_url: normalizePlaybackUrl(result.playback.hls_url),
  });
}
