import {
  AlbumCard,
  HeroMixCard,
  RecentItemCard,
  TallMixCard,
} from "@/components/echo/Cards";
import { SectionHeader } from "@/components/echo/SectionHeader";
import {
  newReleases,
  recentItems,
  topMixFeature,
  topMixSecondary,
} from "@/lib/echo-data";

export function HomeScreen() {
  return (
    <div className="mx-auto max-w-[1240px] space-y-14 pb-8">
      <section className="pt-5 lg:pt-8">
        <h1 className="font-display text-[3.5rem] font-bold leading-[0.96] tracking-tight text-white lg:text-[4rem]">Good evening</h1>
        <p className="mt-4 max-w-xl text-sm text-[var(--on-surface-variant)]">
          Your curated sonic experience is ready.
        </p>
      </section>

      <section className="space-y-6">
        <SectionHeader title="Recently Played" actionLabel="View All" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recentItems.map((item) => (
            <RecentItemCard key={item.title} title={item.title} subtitle={item.subtitle} image={item.image} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader title="Your Top Mixes" />
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6">
            <HeroMixCard
              title={topMixFeature.title}
              description={topMixFeature.description}
              badge={topMixFeature.badge}
              image={topMixFeature.image}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-2">
            {topMixSecondary.map((item) => (
              <TallMixCard key={item.title} title={item.title} subtitle={item.subtitle} image={item.image} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          title="New Releases"
          subtitle="Fresh sounds released this week"
          actionLabel="View All"
        />
        <div className="-mx-1 flex gap-6 overflow-x-auto px-1 pb-2">
          {newReleases.map((release) => (
            <AlbumCard
              key={release.title}
              title={release.title}
              subtitle={release.subtitle}
              image={release.image}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
