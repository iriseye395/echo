import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeWidth="1.8" />
    </BaseIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function LibraryIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="5" width="5" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="10" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="15" y="5" width="5" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
    </BaseIcon>
  );
}

export function RoomsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="8" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 18a3.5 3.5 0 0 1 7 0M12.5 18a3.5 3.5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor" />
    </BaseIcon>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="7" y="6" width="3.5" height="12" rx="1" fill="currentColor" />
      <rect x="13.5" y="6" width="3.5" height="12" rx="1" fill="currentColor" />
    </BaseIcon>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 20s-6.8-4.1-8.7-7.7A5.2 5.2 0 0 1 12 5.4a5.2 5.2 0 0 1 8.7 6.9C18.8 15.9 12 20 12 20Z" stroke="currentColor" strokeWidth="1.8" />
    </BaseIcon>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 10h4l5-4v12l-5-4H4v-4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 9c1.3 1.2 1.3 4.8 0 6M18.5 7c2.8 2.5 2.8 8.5 0 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m14.5 6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m9.5 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function DotsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="6" cy="12" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <circle cx="18" cy="12" r="1.8" fill="currentColor" />
    </BaseIcon>
  );
}
