import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, VolumeIcon } from "@/components/echo/icons";
import { SearchInput } from "@/components/echo/SearchInput";

type TopBarProps = {
  searchPlaceholder?: string;
  largeSearch?: boolean;
  showSearch?: boolean;
  showArrows?: boolean;
};

export function TopBar({
  searchPlaceholder = "Search for artists, tracks, or podcasts",
  largeSearch = false,
  showSearch = true,
  showArrows = false,
}: TopBarProps) {
  return (
    <header className="echo-header-glass fixed left-0 right-0 top-0 z-30 h-16 px-5 lg:left-64 lg:h-16 lg:px-8">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {showArrows ? (
            <>
              <button type="button" className="rounded-lg p-2 text-[var(--on-surface-variant)] hover:bg-white/10 hover:text-white" aria-label="Back">
                <ChevronLeftIcon className="size-4" />
              </button>
              <button type="button" className="rounded-lg p-2 text-[var(--on-surface-variant)] hover:bg-white/10 hover:text-white" aria-label="Forward">
                <ChevronRightIcon className="size-4" />
              </button>
            </>
          ) : null}

          {showSearch ? (
            <div className="max-w-[520px] flex-1">
              <SearchInput placeholder={searchPlaceholder} large={largeSearch} />
            </div>
          ) : (
            <div className="font-display text-lg font-semibold text-white">ECHO</div>
          )}
        </div>

        <div className="flex items-center gap-4 text-[var(--on-surface-variant)]">
          <button type="button" className="rounded-lg p-2 hover:bg-white/10 hover:text-white" aria-label="Notifications">
            <HeartIcon className="size-4" />
          </button>
          <button type="button" className="rounded-lg p-2 hover:bg-white/10 hover:text-white" aria-label="Audio settings">
            <VolumeIcon className="size-4" />
          </button>
          <span className="hidden text-xs uppercase tracking-[0.12em] text-[var(--secondary)] sm:inline">Profile</span>
        </div>
      </div>
    </header>
  );
}
