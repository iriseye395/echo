import { GenreCard } from "@/components/echo/Cards";
import { SearchInput } from "@/components/echo/SearchInput";
import { SectionHeader } from "@/components/echo/SectionHeader";
import { searchGenres } from "@/lib/echo-data";

export function SearchScreen() {
  return (
    <div className="mx-auto max-w-[1240px] space-y-14 pb-8">
      <section className="mx-auto max-w-[920px] pt-4 lg:pt-6">
        <div className="rounded-3xl bg-[var(--surface-container-low)] p-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]">
          <SearchInput placeholder="What do you want to listen to?" large />
        </div>
      </section>

      <section className="space-y-9">
        <SectionHeader
          title="Browse All"
          subtitle="Explore every mood and genre curated for you."
          actionLabel="View All Categories"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {searchGenres.map((genre) => (
            <GenreCard
              key={genre.name}
              name={genre.name}
              gradient={genre.gradient}
              image={genre.image}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
