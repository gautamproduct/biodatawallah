import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/** Shows a fixed-size page (e.g. 794 × 1123) scaled down to fit the available width. */
export function Scaled({ width, height, children, max = 1, className = '' }: { width: number; height: number; children: ReactNode; max?: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => setScale(Math.min(max, el.clientWidth / width));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, max]);
  return (
    <div ref={box} className={`scaled ${className}`}>
      <div style={{ width: width * scale, height: height * scale, overflow: 'hidden', margin: '0 auto' }}>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
      </div>
    </div>
  );
}
