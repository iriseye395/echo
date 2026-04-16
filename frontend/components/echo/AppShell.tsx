import type { ReactNode } from "react";
import type { NavKey } from "@/lib/echo-data";
import { PlaybackProvider } from "@/components/echo/PlaybackProvider";
import { PlayerBar } from "@/components/echo/PlayerBar";
import { Sidebar } from "@/components/echo/Sidebar";
import { TopBar } from "@/components/echo/TopBar";

type AppShellProps = {
  activeNav: NavKey;
  children: ReactNode;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showArrows?: boolean;
  largeSearch?: boolean;
  showPlayer?: boolean;
};

export function AppShell({
  activeNav,
  children,
  searchPlaceholder,
  showSearch,
  showArrows,
  largeSearch,
  showPlayer = true,
}: AppShellProps) {
  return (
    <PlaybackProvider>
      <div className="min-h-screen bg-[var(--surface)] text-white">
        <Sidebar active={activeNav} />
        <TopBar
          searchPlaceholder={searchPlaceholder}
          showSearch={showSearch}
          showArrows={showArrows}
          largeSearch={largeSearch}
        />
        <main className="px-5 pb-40 pt-24 lg:pl-[296px] lg:pr-10 lg:pt-28">{children}</main>
        {showPlayer ? <PlayerBar /> : null}
      </div>
    </PlaybackProvider>
  );
}
