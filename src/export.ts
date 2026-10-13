// The image and PDF libraries load only when a file is made, keeping the first page load fast.

let fontCSS: Promise<string> | null = null;

async function render(node: HTMLElement, pixelRatio: number) {
  const { getFontEmbedCSS, toCanvas } = await import('html-to-image');
  await document.fonts.ready;
  fontCSS ??= getFontEmbedCSS(node);
  return toCanvas(node, { pixelRatio, cacheBust: true, fontEmbedCSS: await fontCSS });
}

export async function nodeToPngBlob(node: HTMLElement, pixelRatio = 1): Promise<Blob> {
  const canvas = await render(node, pixelRatio);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png'))), 'image/png'));
}

/** A4 PDF. The page is rendered as a sharp image so Hindi and Marathi letters always join correctly. */
export async function nodeToPdfBlob(node: HTMLElement): Promise<Blob> {
  const canvas = await render(node, 2.5);
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, w, h, undefined, 'FAST');
  return pdf.output('blob');
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Share files straight into WhatsApp on phones; falls back to downloading. */
export async function shareFiles(files: File[], text: string): Promise<'shared' | 'downloaded'> {
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare && nav.canShare({ files })) {
    try {
      await nav.share({ files, text });
      return 'shared';
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'shared';
    }
  }
  for (const f of files) saveBlob(f, f.name);
  return 'downloaded';
}

export function safeFileName(name: string) {
  return (name || 'biodata').replace(/[^\p{L}\p{M}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 40) || 'biodata';
}

/** Downscale a photo in the browser (keeps the file small, strips EXIF location data). */
export function readPhoto(file: File, maxSide = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.88));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('photo')); };
    img.src = url;
  });
}
