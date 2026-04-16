import Image from "next/image";
import { PauseIcon, PlayIcon } from "@/components/echo/icons";
import { roomListeners } from "@/lib/echo-data";

const roomAlbum = "http://localhost:3845/assets/9b5cc5a8d0f71b784af930d05801ae3ffef891f3.png";

export function RoomScreen() {
  return (
    <div className="mx-auto grid max-w-[1300px] gap-8 pb-10 xl:grid-cols-12 xl:gap-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-[var(--surface-container-low)] p-6 lg:p-8 xl:col-span-8">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[var(--primary)] opacity-20 blur-[70px]" />
        <div className="pointer-events-none absolute -right-20 top-48 h-72 w-72 rounded-full bg-[var(--secondary)] opacity-15 blur-[70px]" />

        <div className="relative">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--secondary)]">Live Session</p>
          <h1 className="mt-2 font-display text-5xl font-bold leading-tight tracking-tight text-white">The Obsidian Lounge</h1>

          <article className="relative mt-8 overflow-hidden rounded-[2.5rem]">
            <Image src={roomAlbum} alt="Midnight Pulsar" width={1100} height={700} className="h-full min-h-[420px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-4xl font-extrabold text-white">Midnight Pulsar</h2>
                  <p className="text-lg text-[var(--on-surface-variant)]">Synthetic Dreams • 2024</p>
                </div>
                <button
                  type="button"
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-dim))] text-[var(--on-primary)] shadow-[0_25px_50px_-12px_rgba(186,158,255,0.4)]"
                  aria-label="Pause"
                >
                  <PauseIcon className="size-5" />
                </button>
              </div>

              <div className="mt-6">
                <div className="h-1.5 rounded-full bg-white/20">
                  <div className="h-full w-2/3 rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-dim))]" />
                </div>
                <div className="mt-2 flex justify-between text-xs text-[var(--outline-variant)]">
                  <span>02:45</span>
                  <span>04:12</span>
                </div>
              </div>
            </div>
          </article>

          <div className="mt-8 flex items-center justify-center gap-10 text-[var(--on-surface-variant)]">
            <button type="button" aria-label="Previous" className="rounded-full p-2 hover:bg-white/10" />
            <button type="button" aria-label="Play" className="rounded-full border border-white/20 p-3 text-white hover:bg-white/10">
              <PlayIcon className="size-5" />
            </button>
            <button type="button" aria-label="Next" className="rounded-full p-2 hover:bg-white/10" />
          </div>
        </div>
      </section>

      <aside className="rounded-[2rem] bg-[var(--surface-container-low)] p-6 xl:col-span-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-white">Listeners</h2>
          <span className="rounded-md bg-[var(--secondary-container)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--on-secondary-container)]">
            24 Active
          </span>
        </div>

        <ul className="mt-6 flex gap-4">
          {roomListeners.map((listener) => (
            <li key={listener.name} className="text-center">
              <Image
                src={listener.image}
                alt={listener.name}
                width={48}
                height={48}
                className={[
                  "mx-auto h-12 w-12 rounded-full object-cover",
                  listener.host ? "ring-2 ring-[var(--primary)]" : "",
                ].join(" ")}
              />
              <p className={[
                "mt-2 text-[10px] font-bold",
                listener.host ? "text-[var(--primary)]" : "text-[var(--on-surface-variant)]",
              ].join(" ")}>
                {listener.name}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 space-y-4">
          <article className="rounded-2xl border-l-2 border-[var(--primary)] bg-[var(--surface-container-high)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--primary)]">Alex (Host)</p>
            <p className="mt-1 text-sm text-white">Welcome everyone! Sit back and enjoy the vibe.</p>
          </article>
          <article className="rounded-2xl bg-[var(--surface-container-high)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--secondary)]">Sarah</p>
            <p className="mt-1 text-sm text-white">This transition is unreal.</p>
          </article>
        </div>

        <form className="mt-6">
          <label className="sr-only" htmlFor="room-message">
            Message room
          </label>
          <input
            id="room-message"
            type="text"
            placeholder="Drop your reaction..."
            className="w-full rounded-xl bg-[var(--surface-container-high)] px-4 py-3 text-sm text-white placeholder:text-[var(--outline-variant)] focus:outline-none"
          />
        </form>
      </aside>
    </div>
  );
}
