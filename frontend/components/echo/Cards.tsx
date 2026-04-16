"use client";

import Image from "next/image";
import { usePlayback, type PlaybackTrack } from "@/components/echo/PlaybackProvider";
import { DotsIcon, PlayIcon, PlusIcon } from "@/components/echo/icons";

type ImageCardProps = {
  title: string;
  subtitle: string;
  image: string;
};

type RecentItemCardProps = ImageCardProps & {
  playbackTrack?: PlaybackTrack;
};

export function RecentItemCard({ title, subtitle, image, playbackTrack }: RecentItemCardProps) {
  const { playTrack } = usePlayback();

  return (
    <article className="group flex items-center gap-4 rounded-xl bg-[var(--surface-container-low)] p-0 pr-4">
      <Image src={image} alt={title} width={80} height={80} className="h-20 w-20 rounded-l-xl object-cover" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium text-white">{title}</h3>
        <p className="truncate text-xs text-[var(--on-surface-variant)]">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          if (playbackTrack) {
            void playTrack(playbackTrack);
          }
        }}
        disabled={!playbackTrack}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)] opacity-0 transition group-hover:opacity-100"
        aria-label={`Play ${title}`}
      >
        <PlayIcon className="size-4" />
      </button>
    </article>
  );
}

type HeroMixCardProps = {
  title: string;
  description: string;
  badge: string;
  image: string;
};

export function HeroMixCard({ title, description, badge, image }: HeroMixCardProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl bg-[var(--surface-container-highest)]">
      <Image src={image} alt={title} width={800} height={800} className="h-full min-h-80 w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-8">
        <p className="inline-flex rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--secondary)]">
          {badge}
        </p>
        <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-white">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-[var(--on-surface-variant)]">{description}</p>
        <button
          type="button"
          className="mt-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-dim))] text-[var(--on-primary)] shadow-[0_20px_40px_rgba(186,158,255,0.24)]"
          aria-label={`Play ${title}`}
        >
          <PlayIcon className="size-5" />
        </button>
      </div>
    </article>
  );
}

export function TallMixCard({ title, subtitle, image }: ImageCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl bg-[var(--surface-container-highest)]">
      <Image src={image} alt={title} width={560} height={760} className="h-full min-h-80 w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
        <p className="text-xs uppercase tracking-[0.08em] text-[var(--on-surface-variant)]">{subtitle}</p>
      </div>
      <button
        type="button"
        className="absolute right-4 top-4 hidden h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition group-hover:flex"
        aria-label={`Open ${title}`}
      >
        <DotsIcon className="size-4" />
      </button>
    </article>
  );
}

export function AlbumCard({ title, subtitle, image }: ImageCardProps) {
  return (
    <article className="min-w-44 max-w-44">
      <Image src={image} alt={title} width={176} height={176} className="h-44 w-44 rounded-2xl object-cover" />
      <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
      <p className="text-xs text-[var(--on-surface-variant)]">{subtitle}</p>
    </article>
  );
}

type LibraryTileProps = {
  title: string;
  subtitle: string;
  image: string;
};

export function LibraryTile({ title, subtitle, image }: LibraryTileProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl bg-[var(--surface-container-highest)]">
      <Image src={image} alt={title} width={560} height={400} className="h-full min-h-40 w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-[var(--on-surface-variant)]">{subtitle}</p>
      </div>
    </article>
  );
}

type GenreCardProps = {
  name: string;
  gradient: string;
  image: string;
};

export function GenreCard({ name, gradient, image }: GenreCardProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl p-6" style={{ backgroundImage: gradient }}>
      <h3 className="font-display text-2xl font-extrabold tracking-tight text-white">{name}</h3>
      <Image
        src={image}
        alt={name}
        width={112}
        height={112}
        className="absolute -bottom-8 -right-8 h-28 w-28 rotate-12 rounded-lg object-cover shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
      />
    </article>
  );
}

type TrackRowProps = {
  index: number;
  title: string;
  album: string;
  plays: string;
  duration: string;
  image: string;
};

export function TrackRow({ index, title, album, plays, duration, image }: TrackRowProps) {
  return (
    <li className="group grid grid-cols-[40px_minmax(0,2fr)_minmax(0,1fr)_60px_24px] items-center gap-4 rounded-xl bg-[var(--surface)] px-4 py-3 transition hover:bg-[var(--surface-bright)] hover:pl-5">
      <span className="text-sm text-[var(--on-surface-variant)]">{index}</span>
      <div className="flex items-center gap-3">
        <Image src={image} alt={title} width={36} height={48} className="h-12 w-9 rounded-lg object-cover" />
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--on-surface-variant)]">{album}</p>
        </div>
      </div>
      <span className="text-sm text-[var(--on-surface-variant)]">{plays}</span>
      <span className="text-sm text-[var(--on-surface-variant)]">{duration}</span>
      <button type="button" className="text-[var(--on-surface-variant)] hover:text-white" aria-label={`Options for ${title}`}>
        <DotsIcon className="size-4" />
      </button>
    </li>
  );
}

export function UploadTile() {
  return (
    <article className="flex flex-col items-center justify-center rounded-3xl bg-[var(--surface-container-high)] px-6 py-8 text-center shadow-[inset_0_0_0_1px_rgba(73,72,71,0.15)]">
      <button
        type="button"
        className="inline-flex h-10 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-dim))] text-[var(--on-primary)]"
      >
        <PlusIcon className="size-4" />
      </button>
      <h3 className="mt-4 font-display text-lg font-semibold text-white">Upload New Track</h3>
      <p className="mt-2 text-xs text-[var(--on-surface-variant)]">Lossless FLAC, WAV, or MP3</p>
    </article>
  );
}
