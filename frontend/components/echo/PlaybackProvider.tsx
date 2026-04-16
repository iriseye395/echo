"use client";

import Hls from "hls.js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type PlaybackTrack = {
  trackId: string;
  title: string;
  artist: string;
  image: string;
};

type PlaybackContextValue = {
  currentTrack: PlaybackTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  progressPercent: number;
  error: string | null;
  playTrack: (track: PlaybackTrack) => Promise<void>;
  togglePlayback: () => Promise<void>;
  seekToPercent: (percent: number) => void;
  setVolume: (value: number) => void;
  volume: number;
};

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

function formatFiniteNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [currentTrack, setCurrentTrack] = useState<PlaybackTrack | null>(null);
  const [currentSourceUrl, setCurrentSourceUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.75);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = volume;

    const onTimeUpdate = () => setCurrentTime(formatFiniteNumber(audio.currentTime));
    const onDurationChange = () => setDuration(formatFiniteNumber(audio.duration));
    const onEnded = () => setIsPlaying(false);
    const onPlaying = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      hlsRef.current?.destroy();
      hlsRef.current = null;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSourceUrl) {
      return;
    }

    setError(null);
    hlsRef.current?.destroy();
    hlsRef.current = null;

    if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      audio.src = currentSourceUrl;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(currentSourceUrl);
      hls.attachMedia(audio);
      hlsRef.current = hls;
    } else {
      setError("HLS playback is not supported in this browser");
      return;
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false);
        setError("Playback could not start");
      });
  }, [currentSourceUrl]);

  const playTrack = useCallback(async (track: PlaybackTrack) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/tracks/${track.trackId}/playback`, {
        method: "GET",
      });

      if (!res.ok) {
        setError("Track playback is unavailable");
        return;
      }

      const data = (await res.json()) as { track_id: string; hls_url: string };
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(0);
      setCurrentSourceUrl(data.hls_url);
    } catch {
      setError("Failed to connect to playback service");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setError("Playback could not resume");
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const seekToPercent = useCallback(
    (percent: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) {
        return;
      }
      const clamped = Math.min(100, Math.max(0, percent));
      const target = (clamped / 100) * duration;
      audio.currentTime = target;
      setCurrentTime(target);
    },
    [duration],
  );

  const setVolume = useCallback((nextVolume: number) => {
    setVolumeState(Math.min(1, Math.max(0, nextVolume)));
  }, []);

  const progressPercent = useMemo(() => {
    if (!duration) {
      return 0;
    }
    return Math.min(100, (currentTime / duration) * 100);
  }, [currentTime, duration]);

  const value = useMemo<PlaybackContextValue>(
    () => ({
      currentTrack,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      progressPercent,
      error,
      playTrack,
      togglePlayback,
      seekToPercent,
      setVolume,
      volume,
    }),
    [
      currentTrack,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      progressPercent,
      error,
      playTrack,
      togglePlayback,
      seekToPercent,
      setVolume,
      volume,
    ],
  );

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}

export function usePlayback(): PlaybackContextValue {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used inside PlaybackProvider");
  }
  return context;
}

export type { PlaybackTrack };
