import Image from "next/image";
import { HeartIcon, PlayIcon } from "@/components/echo/icons";

const heroArtwork = "http://localhost:3845/assets/cd693c5a656cbb145748ad90a0e3a200f8ab70ed.png";

const waveform = [16, 28, 42, 20, 60, 84, 48, 36, 96, 48, 62, 34, 38, 74, 52, 30, 46, 70, 26, 58, 40, 24, 12];

export function PlayerScreen() {
  return (
    <div className="mx-auto max-w-[1300px] pb-12">
      <div className="grid gap-10 xl:grid-cols-12 xl:gap-12">
        <section className="xl:col-span-5">
          <div className="relative overflow-hidden rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-[var(--primary)] opacity-20 blur-2xl" />
            <Image
              src={heroArtwork}
              alt="Midnight Echoes"
              width={820}
              height={980}
              className="relative h-full min-h-[460px] w-full rounded-3xl object-cover"
            />
          </div>
          <div className="mt-7">
            <h1 className="font-display text-[3.5rem] font-bold leading-none tracking-tight text-white">Midnight Echoes</h1>
            <p className="mt-3 text-xl text-[var(--on-surface-variant)]">Lumina Specter • Neon Pulse (2024)</p>
          </div>
        </section>

        <section className="xl:col-span-7">
          <div className="rounded-3xl bg-white/5 p-8 shadow-[inset_0_0_0_1px_rgba(73,72,71,0.15)] backdrop-blur-sm">
            <div className="grid h-28 grid-cols-24 items-end gap-1">
              {waveform.map((value, idx) => (
                <span
                  key={`${value}-${idx}`}
                  className={idx < 14 ? "rounded-full bg-[var(--secondary)]" : "rounded-full bg-[var(--surface-variant)]"}
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>

            <div className="mt-6 h-1.5 rounded-full bg-[var(--surface-container-highest)]">
              <div className="h-full w-[65%] rounded-full bg-[linear-gradient(90deg,var(--primary),var(--secondary))]" />
            </div>
            <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.1em] text-[var(--on-surface-variant)]">
              <span>02:45</span>
              <span>04:12</span>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <article className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-[var(--primary)]">Lyrics</h2>
              <p className="text-xl leading-tight text-[var(--on-surface-variant)] line-through opacity-40">
                The city breathes in neon light
              </p>
              <p className="text-xl leading-tight text-[var(--on-surface-variant)]">
                We&apos;re chasing shadows through the night
              </p>
              <p className="font-display text-2xl font-bold leading-tight text-white">
                Midnight echoes in my mind
              </p>
              <p className="text-xl leading-tight text-[var(--on-surface-variant)]">Leaving all the world behind</p>
            </article>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="rounded-3xl bg-white/5 p-6 text-left">
                <HeartIcon className="size-5 text-[var(--tertiary)]" />
                <p className="mt-6 text-xs uppercase tracking-[0.1em] text-white">Add to Fav</p>
              </button>
              <button type="button" className="rounded-3xl bg-white/5 p-6 text-left">
                <p className="text-xs uppercase tracking-[0.1em] text-white">Share Track</p>
              </button>
              <button type="button" className="col-span-2 flex items-center justify-between rounded-3xl bg-white/5 p-6">
                <span className="text-sm uppercase tracking-[0.1em] text-white">Queue</span>
                <PlayIcon className="size-4 text-[var(--secondary)]" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
