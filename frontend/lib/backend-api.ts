import "server-only";

import { cache } from "react";
import type { ArtworkItem } from "@/lib/echo-data";
import { libraryCards, newReleases } from "@/lib/echo-data";

const API_BASE_URL =
  process.env.INTERNAL_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

const SERVICE_EMAIL = process.env.ECHO_BACKEND_EMAIL || "admin@gmail.com";
const SERVICE_PASSWORD = process.env.ECHO_BACKEND_PASSWORD || "admin";

export type BackendTrack = {
  id: string;
  title: string;
  artist: string;
  duration: number | null;
  status: "uploaded" | "processing" | "ready" | "failed";
  created_at: string;
};

type LoginResponse = {
  access_token: string;
};

export type BackendPlaybackResponse = {
  track_id: string;
  hls_url: string;
};

type BackendErrorResponse = {
  detail?: string;
};

const getServiceToken = cache(async (): Promise<string | null> => {
  const body = new URLSearchParams({
    username: SERVICE_EMAIL,
    password: SERVICE_PASSWORD,
  });

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as LoginResponse;
    return data.access_token;
  } catch {
    return null;
  }
});

export async function fetchBackendTracks(): Promise<{
  connected: boolean;
  tracks: BackendTrack[];
}> {
  const token = await getServiceToken();
  if (!token) {
    return { connected: false, tracks: [] };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { connected: false, tracks: [] };
    }

    const tracks = (await res.json()) as BackendTrack[];
    return { connected: true, tracks };
  } catch {
    return { connected: false, tracks: [] };
  }
}

export async function fetchBackendTrackPlayback(
  trackId: string,
): Promise<{
  connected: boolean;
  playback: BackendPlaybackResponse | null;
  statusCode: number;
  detail: string;
}> {
  const token = await getServiceToken();
  if (!token) {
    return {
      connected: false,
      playback: null,
      statusCode: 401,
      detail: "Unable to authenticate with backend service",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/tracks/${trackId}/playback`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      let detail = "Unable to fetch playback URL";
      try {
        const body = (await res.json()) as BackendErrorResponse;
        if (body.detail) {
          detail = body.detail;
        }
      } catch {
        // Ignore non-JSON bodies.
      }

      return {
        connected: false,
        playback: null,
        statusCode: res.status,
        detail,
      };
    }

    const playback = (await res.json()) as BackendPlaybackResponse;
    return {
      connected: true,
      playback,
      statusCode: 200,
      detail: "",
    };
  } catch {
    return {
      connected: false,
      playback: null,
      statusCode: 502,
      detail: "Backend playback service is unreachable",
    };
  }
}

function formatDuration(seconds: number | null): string {
  if (!seconds || Number.isNaN(seconds)) {
    return "--:--";
  }

  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

export function mapTracksToArtwork(tracks: BackendTrack[], limit = 6): ArtworkItem[] {
  const imagePool = [...libraryCards, ...newReleases].map((item) => item.image);

  return tracks.slice(0, limit).map((track, index) => {
    const image = imagePool[index % imagePool.length] || libraryCards[0].image;

    return {
      id: track.id,
      artist: track.artist,
      title: track.title,
      subtitle: `${track.artist} • ${track.status.toUpperCase()} • ${formatDuration(track.duration)}`,
      image,
    };
  });
}
