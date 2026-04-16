import { SearchIcon } from "@/components/echo/icons";

type SearchInputProps = {
  placeholder: string;
  large?: boolean;
};

export function SearchInput({ placeholder, large = false }: SearchInputProps) {
  return (
    <label
      className={[
        "relative flex w-full items-center rounded-full bg-[var(--surface-container-low)] text-[var(--on-surface-variant)]",
        large ? "rounded-3xl px-6 py-6 pl-20" : "px-4 py-3 pl-11",
      ].join(" ")}
    >
      <SearchIcon className={large ? "absolute left-6 size-6" : "absolute left-4 size-4"} />
      <input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        className={[
          "w-full bg-transparent outline-none placeholder:text-[var(--outline-variant)]",
          large
            ? "font-display text-2xl font-semibold tracking-tight"
            : "text-xs font-medium uppercase tracking-[0.12em]",
        ].join(" ")}
      />
    </label>
  );
}
