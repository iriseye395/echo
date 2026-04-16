type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
};

export function SectionHeader({ title, subtitle, actionLabel }: SectionHeaderProps) {
  return (
    <div className="flex w-full items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-semibold leading-8 text-white">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-[var(--on-surface-variant)]">{subtitle}</p>
        ) : null}
      </div>
      {actionLabel ? (
        <button
          className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--secondary)] transition-opacity hover:opacity-80"
          type="button"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
