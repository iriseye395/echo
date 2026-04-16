import Image from "next/image";
import Link from "next/link";
import type { NavKey } from "@/lib/echo-data";
import { HomeIcon, LibraryIcon, RoomsIcon, SearchIcon } from "@/components/echo/icons";

const navItems: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "home", label: "Home", href: "/" },
  { key: "search", label: "Search", href: "/search" },
  { key: "library", label: "Library", href: "/library" },
  { key: "rooms", label: "Rooms", href: "/rooms" },
];

const iconMap = {
  home: HomeIcon,
  search: SearchIcon,
  library: LibraryIcon,
  rooms: RoomsIcon,
};

type SidebarProps = {
  active: NavKey;
};

export function Sidebar({ active }: SidebarProps) {
  return (
    <aside className="echo-glass fixed left-0 top-0 z-40 hidden h-full w-64 flex-col justify-between px-6 py-8 lg:flex">
      <div>
        <div className="mb-12">
          <p className="font-display text-3xl font-bold tracking-tight text-white">Echo</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">Premium Audio</p>
        </div>

        <nav aria-label="Main" className="space-y-2">
          {navItems.map((item) => {
            const Icon = iconMap[item.key];
            const isActive = item.key === active;

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-[var(--surface-container-high)] text-white shadow-[inset_-2px_0_0_0_#8b5cf6]"
                    : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] hover:text-white",
                ].join(" ")}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="mt-8 w-full rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-dim))] px-4 py-3 text-sm font-bold text-[var(--on-primary)]"
        >
          Create Playlist
        </button>

        <div className="mt-8 space-y-2">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--outline-variant)]">Favorites</p>
          <p className="rounded-xl px-4 py-2 text-sm text-[var(--on-surface-variant)]">Liked Songs</p>
          <p className="rounded-xl px-4 py-2 text-sm text-[var(--on-surface-variant)]">Top Mixes</p>
        </div>
      </div>

      <button type="button" className="flex items-center gap-3">
        <Image
          src="http://localhost:3845/assets/e5fb7fe11afcbbe88f453e6342a547d3ee58bcd3.png"
          alt="Alex Rivera"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="text-left">
          <span className="block text-sm font-semibold text-white">Alex Rivera</span>
          <span className="block text-xs text-[var(--outline-variant)]">Pro Member</span>
        </span>
      </button>
    </aside>
  );
}
