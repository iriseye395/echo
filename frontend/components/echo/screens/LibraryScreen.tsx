import { ChipTabs } from "@/components/echo/Chips";
import { LibraryTile, UploadTile } from "@/components/echo/Cards";
import { SectionHeader } from "@/components/echo/SectionHeader";
import { libraryCards, libraryTabs, type ArtworkItem } from "@/lib/echo-data";

type LibraryScreenProps = {
  backendUploads?: ArtworkItem[];
  backendConnected?: boolean;
};

export function LibraryScreen({ backendUploads = [], backendConnected = false }: LibraryScreenProps) {
  const displayCards = backendUploads.length > 0 ? backendUploads : libraryCards;

  return (
    <div className="mx-auto max-w-[1240px] space-y-12 pb-8">
      <section className="pt-4 lg:pt-6">
        <h1 className="font-display text-[3.5rem] font-bold tracking-tight text-white lg:text-[4rem]">Your Library</h1>
        <div className="mt-7">
          <ChipTabs items={libraryTabs} active="Playlists" />
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          title={backendConnected ? "Cloud Uploads" : "Saved Collections"}
          subtitle={backendConnected ? "Pulled from FastAPI track service" : "Local curated collections"}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <UploadTile />
        {displayCards.map((item, index) => (
          <LibraryTile
            key={item.id ?? `${item.title}-${item.subtitle}-${index}`}
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
          />
        ))}
        </div>
      </section>
    </div>
  );
}
