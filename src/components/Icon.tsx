// Small line icons (24px grid, 1.6 stroke) so the interface stays calm and consistent.
const PATHS: Record<string, string> = {
  ring: 'M12 8a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM9 3h6l-1.5 3h-3z',
  briefcase: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  file: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  shield: 'M12 3l7 3v6c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6zM9 12l2 2 4-4',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  mic: 'M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3zM6 11a6 6 0 0 0 12 0M12 17v3',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  eyeOff: 'M4 4l16 16M9.9 5.8A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.3 7.6A16 16 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4-.9',
  camera: 'M4 8h3l2-2.5h6L17 8h3v11H4zM12 10.5a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z',
  download: 'M12 4v11M7 10.5l5 5 5-5M5 20h14',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  trash: 'M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13',
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  chat: 'M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5',
  user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4.5 20c1-3.6 4-5.5 7.5-5.5s6.5 1.9 7.5 5.5',
  phone: 'M8 3h8v18H8zM11 18h2',
  undo: 'M5 9h10a4.5 4.5 0 0 1 0 9H9M8.5 5.5L5 9l3.5 3.5',
  palette: 'M12 3.5a8.5 8.5 0 1 0 0 17c1 0 1.6-.7 1.6-1.6 0-1.2-1-1.5-1-2.6 0-.9.7-1.6 1.6-1.6H17a3.5 3.5 0 0 0 3.5-3.5c0-4.4-3.8-7.7-8.5-7.7zM7.5 12h.01M9.5 8h.01M14.5 8h.01',
  rupee: 'M7 5h10M7 9h10M7 5c4.5 0 6 1.5 6 4s-2 4-6 4l7 6',
};

export function Icon({ name, size = 20, className = '' }: { name: keyof typeof PATHS | string; size?: number; className?: string }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <path d={PATHS[name] ?? ''} />
    </svg>
  );
}
