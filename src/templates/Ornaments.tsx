// Vector ornaments for the biodata templates. All use currentColor so each palette recolours them.

/** Fine line-art floral spray for a page corner. */
export function FloralCorner({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  const leaves = [
    [60, 150, -35], [92, 118, -55], [126, 92, -20], [150, 60, -60], [40, 196, -10], [178, 40, -35],
    [110, 150, 30], [150, 112, 15], [70, 220, 20],
  ];
  return (
    <svg className={`orn ${className}`} viewBox="0 0 260 260" style={flip ? { transform: 'scale(-1,-1)' } : undefined} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M6 254 C 60 200, 120 140, 250 8" />
        <path d="M40 220 C 70 190, 80 170, 84 140" />
        <path d="M120 140 C 150 130, 170 110, 186 84" />
        <path d="M150 104 C 160 80, 158 60, 150 40" />
      </g>
      <g fill="currentColor" fillOpacity=".16" stroke="currentColor" strokeWidth="1">
        {leaves.map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="16" ry="6.5" transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </g>
      <g fill="currentColor">
        {[[84, 136], [188, 82], [150, 38], [228, 22], [26, 238]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="7" fillOpacity=".18" />
            <circle cx={x} cy={y} r="2.6" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Concentric mandala, drawn procedurally. */
export function Mandala({ className = '' }: { className?: string }) {
  const ring = (n: number, r: number, rx: number, ry: number) =>
    Array.from({ length: n }, (_, i) => (
      <ellipse key={`${r}-${i}`} cx="200" cy={200 - r} rx={rx} ry={ry} transform={`rotate(${(360 / n) * i} 200 200)`} />
    ));
  return (
    <svg className={`orn ${className}`} viewBox="0 0 400 400" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {[40, 70, 112, 150, 186, 196].map((r) => <circle key={r} cx="200" cy="200" r={r} />)}
        {ring(16, 92, 10, 24)}
        {ring(24, 132, 8, 20)}
        {ring(32, 168, 6, 16)}
        {ring(8, 55, 9, 16)}
      </g>
      <g fill="currentColor" fillOpacity=".12">{ring(16, 92, 10, 24)}</g>
    </svg>
  );
}

/** Art-deco corner with stepped gold lines. */
export function DecoCorner({ className = '' }: { className?: string }) {
  return (
    <svg className={`orn ${className}`} viewBox="0 0 120 120" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 116 V4 H116" />
        <path d="M14 116 V14 H116" />
        <path d="M24 60 V24 H60" />
        <path d="M24 24 L44 44" />
        <circle cx="48" cy="48" r="4" fill="currentColor" />
      </g>
    </svg>
  );
}

/** Line — diamond — line divider. */
export function Divider({ className = '' }: { className?: string }) {
  return (
    <svg className={`orn divider ${className}`} viewBox="0 0 220 12" aria-hidden>
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M0 6 H92" /><path d="M128 6 H220" />
        <path d="M110 1 L115 6 L110 11 L105 6 Z" fill="currentColor" />
        <circle cx="98" cy="6" r="1.6" fill="currentColor" /><circle cx="122" cy="6" r="1.6" fill="currentColor" />
      </g>
    </svg>
  );
}

const SECTION_ICONS: Record<string, string> = {
  personal: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4.5 20c1-3.6 4-5.5 7.5-5.5s6.5 1.9 7.5 5.5',
  career: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  family: 'M8 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM16 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 19c.6-2.8 2.6-4.5 5-4.5s4.4 1.7 5 4.5M11 19c.6-2.8 2.6-4.5 5-4.5s4.4 1.7 5 4.5',
  kundli: 'M12 3l9 9-9 9-9-9zM12 3v18M3 12h18',
  about: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  expectations: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z',
  contact: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z',
  objective: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 11.5v1',
  education: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5',
  experience: 'M4 8h16v11H4zM9 8V5h6v3',
  skills: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z',
  achievements: 'M8 4h8v5a4 4 0 0 1-8 0zM5 5h3v3a3 3 0 0 1-3-3zM19 5h-3v3a3 3 0 0 0 3-3zM12 13v4M8 20h8',
  hobbies: 'M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM19 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z',
  declaration: 'M7 3h7l4 4v14H7zM10 13l2 2 4-4',
};

export function SectionIcon({ k }: { k: string | null }) {
  const d = (k && SECTION_ICONS[k]) || 'M6 12h12';
  return (
    <svg className="sicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
