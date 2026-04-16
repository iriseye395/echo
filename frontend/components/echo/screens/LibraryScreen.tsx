import { ChipTabs } from "@/components/echo/Chips";
import { LibraryTile, UploadTile } from "@/components/echo/Cards";
import { libraryCards, libraryTabs } from "@/lib/echo-data";

export function LibraryScreen() {
  return (
    <div className="mx-auto max-w-[1240px] space-y-12 pb-8">
      <section className="pt-4 lg:pt-6">
        <h1 className="font-display text-[3.5rem] font-bold tracking-tight text-white lg:text-[4rem]">Your Library</h1>
        <div className="mt-7">
          <ChipTabs items={libraryTabs} active="Playlists" />
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <UploadTile />
        {libraryCards.map((item) => (
          <LibraryTile key={item.title} title={item.title} subtitle={item.subtitle} image={item.image} />
        ))}
      </section>
    </div>
  );
}
