import Image from "next/image";
import { AlbumCard, TrackRow } from "@/components/echo/Cards";
import { artistDiscography, artistTracks } from "@/lib/echo-data";

const heroArtist = "http://localhost:3845/assets/58028a0bd6a1bad4e0861d8124259d5d32008df4.png";
const bioPortrait = "http://localhost:3845/assets/c31e80bfdd69ed308312d5d5d74d3ddbfd803045.png";

export function ArtistScreen() {
  return (
    <div className="mx-auto max-w-[1300px] space-y-12 pb-10">
      <section className="relative overflow-hidden rounded-[2.5rem]">
        <Image src={heroArtist} alt="Velvet" width={1440} height={560} className="h-[560px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
          <p className="inline-flex rounded-full bg-[rgba(0,105,107,0.3)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--secondary)] backdrop-blur-sm">
            Verified Artist
          </p>
          <h1 className="mt-4 font-display text-6xl font-bold tracking-tight text-white lg:text-8xl">VELVET</h1>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-dim))] px-10 py-4 text-base font-bold text-[var(--on-primary)]"
            >
              Play Latest
            </button>
            <button
              type="button"
              className="rounded-full border border-[color-mix(in_srgb,var(--outline-variant)_30%,transparent)] px-8 py-4 text-base font-bold text-white"
            >
              Follow
            </button>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">
              34,102,895 monthly listeners
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <div className="mb-5 flex items-center gap-4">
            <h2 className="font-display text-[1.75rem] font-semibold text-white">Popular</h2>
            <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--outline-variant)_15%,transparent)]" />
          </div>
          <ol className="space-y-2">
            {artistTracks.map((track) => (
              <TrackRow
                key={track.index}
                index={track.index}
                title={track.title}
                album={track.album}
                plays={track.plays}
                duration={track.duration}
                image={track.image}
              />
            ))}
          </ol>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <article className="rounded-3xl bg-[var(--surface-container-low)] p-6">
            <h3 className="font-display text-xl font-semibold text-white">Artist Bio</h3>
            <Image
              src={bioPortrait}
              alt="Velvet portrait"
              width={640}
              height={448}
              className="mt-4 h-56 w-full rounded-2xl object-cover"
            />
            <p className="mt-4 text-sm leading-relaxed text-[var(--on-surface-variant)]">
              Velvet blends cinematic synth textures with intimate vocal storytelling. Their work balances
              emotional tension and nocturnal groove.
            </p>
          </article>

          <article>
            <h3 className="mb-3 font-display text-xl font-semibold text-white">Discography</h3>
            <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
              {artistDiscography.map((album) => (
                <AlbumCard key={album.title} title={album.title} subtitle={album.subtitle} image={album.image} />
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
