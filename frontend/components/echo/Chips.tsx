type ChipTabsProps = {
  items: string[];
  active: string;
};

export function ChipTabs({ items, active }: ChipTabsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const isActive = item === active;

        return (
          <button
            key={item}
            type="button"
            aria-pressed={isActive}
            className={[
              "rounded-full px-6 py-2 text-sm font-semibold transition",
              isActive
                ? "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
                : "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-bright)] hover:text-white",
            ].join(" ")}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
