import jsPDF from "jspdf";
import type { TextOptionsLight } from "jspdf";
import type { Product } from "@/types/products";
import logoLight from "@/assets/logo-light-trazo.png";

const IS_DEV: boolean =
  (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV ?? false;
const devDebug = (...args: unknown[]) => {
  if (IS_DEV) console.debug("[pdf]", ...args);
};

async function toDataURL(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { credentials: "omit" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) || null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("Error convirtiendo imagen a Base64:", err);
    return null;
  }
}

async function toDataURLOptimized(
  url: string,
  {
    maxDim = 256,
    quality = 0.75,
    preferPng = false,
  }: { maxDim?: number; quality?: number; preferPng?: boolean } = {}
): Promise<string | null> {
  try {
    const res = await fetch(url, { credentials: "omit" });
    if (!res.ok) return null;
    const blob = await res.blob();

    let bmp: ImageBitmap | null = null;
    if (typeof createImageBitmap === "function") {
      try {
        bmp = await createImageBitmap(blob);
      } catch (err) {
        devDebug("createImageBitmap failed", err);
        bmp = null;
      }
    }

    const dims = await (async () => {
      if (bmp) return { w: bmp.width, h: bmp.height, img: bmp as ImageBitmap };
      return await new Promise<{
        w: number;
        h: number;
        img: HTMLImageElement | ImageBitmap;
      } | null>((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve({ w: img.naturalWidth, h: img.naturalHeight, img });
        img.onerror = () => resolve(null);
        img.src = URL.createObjectURL(blob);
      });
    })();
    if (!dims) return await toDataURL(url);

    const { w, h, img } = dims;
    const scale = Math.min(1, maxDim / Math.max(w, h));
    const outW = Math.max(1, Math.round(w * scale));
    const outH = Math.max(1, Math.round(h * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return await toDataURL(url);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if ("close" in img && typeof (img as ImageBitmap).close === "function") {
      ctx.drawImage(img as ImageBitmap, 0, 0, outW, outH);
      (img as ImageBitmap).close();
    } else {
      ctx.drawImage(img as HTMLImageElement, 0, 0, outW, outH);
      try {
        URL.revokeObjectURL((img as HTMLImageElement).src);
      } catch (err) {
        devDebug("revokeObjectURL failed", err);
      }
    }

    if (preferPng) return canvas.toDataURL("image/png");
    return canvas.toDataURL("image/jpeg", quality);
  } catch (err) {
    console.warn("Error optimizando imagen a Base64:", err);
    return null;
  }
}

function money(n: number): string {
  try {
    return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

type ExportOptions = {
  title?: string;
  logoUrl?: string;
  gradientA?: [number, number, number] | string;
  gradientB?: [number, number, number] | string;
  newPagePerCategory?: boolean;
  includeImages?: boolean;
  imageMaxDim?: number;
  imageQuality?: number;
  concurrency?: number;
  categoryName?: string; // compat
};

export async function exportProductsPdf(
  products: Product[],
  opts: ExportOptions = {}
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 14;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const title = opts.title ?? "Lista de Precios WeldZone";

  // Paleta por defecto: Acero frío (azul → índigo)
  const defaultB: [number, number, number] = [247, 181, 0]; // #F7B500

  const parseRGB = (
    v: [number, number, number] | string | undefined,
    fallback: [number, number, number]
  ): [number, number, number] => {
    if (!v) return fallback;
    if (Array.isArray(v) && v.length === 3)
      return [v[0] as number, v[1] as number, v[2] as number];
    if (typeof v === "string") {
      let hex = v.trim();
      if (hex.startsWith("#")) hex = hex.slice(1);
      if (hex.length === 3)
        hex = hex
          .split("")
          .map((c) => c + c)
          .join("");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if ([r, g, b].every((n) => Number.isFinite(n))) return [r, g, b];
    }
    return fallback;
  };
  const headerColor = parseRGB(opts.gradientB, defaultB);

  const drawPageHeader = async (pageNum: number) => {
    // Encabezado sólido
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
    doc.rect(0, 0, pageW, 18, "F");
    let logoData: string | null = null;
    try {
      const logoPath = opts.logoUrl ?? logoLight;
      logoData = await toDataURLOptimized(logoPath, {
        maxDim: 256,
        quality: 0.85,
        preferPng: true,
      });
    } catch (err) {
      console.warn("No se pudo cargar el logo:", err);
    }
    if (logoData) {
      try {
        doc.addImage(logoData, "PNG", margin, 3, 55, 12, undefined, "FAST");
      } catch (err) {
        console.warn("Error insertando el logo:", err);
      }
    }
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    // Centrar título en el encabezado
    doc.text(title, pageW / 2, 9, { align: "center" } as TextOptionsLight);
    doc.setFontSize(9);
    doc.text(`Página ${pageNum}`, pageW - margin - 18, 9);
  };

  const drawFooter = (pageNum: number) => {
    const ts = new Date().toLocaleString("es-MX");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Generado: ${ts} | Página ${pageNum}`, margin, pageH - 6);
    doc.setTextColor(0);
  };

  const isMobile =
    typeof navigator !== "undefined" &&
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const includeImages = opts.includeImages ?? !isMobile;
  let imageDataMap = new Map<string | number, string | null>();
  if (includeImages) {
    const limit = Math.max(
      1,
      Math.floor(opts.concurrency ?? (isMobile ? 3 : 6))
    );
    const queue = [...products];
    const results: Array<[string | number, string | null]> = [];
    async function worker() {
      while (queue.length) {
        const p = queue.shift()!;
        const src = p.imagenUrl || "";
        const ext = src.toLowerCase();
        const dataUrl = src
          ? await toDataURLOptimized(src, {
              maxDim: opts.imageMaxDim ?? (isMobile ? 160 : 256),
              quality: opts.imageQuality ?? (isMobile ? 0.6 : 0.75),
              preferPng: ext.endsWith(".png") || ext.endsWith(".webp"),
            })
          : null;
        results.push([p.id, dataUrl]);
      }
    }
    const workers = Array.from(
      { length: Math.min(limit, Math.max(1, products.length)) },
      () => worker()
    );
    await Promise.all(workers);
    imageDataMap = new Map(results);
  }

  const grouped = products.reduce((acc, p) => {
    const cat = p.categoria?.nombre || "Sin categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  let y = 26;
  let pageNum = 1;
  await drawPageHeader(pageNum);
  drawFooter(pageNum);

  let globalTotal = 0;
  const newPagePerCategory = opts.newPagePerCategory !== false;
  let firstCategory = true;

  for (const [catName, catProducts] of Object.entries(grouped)) {
    if (!firstCategory && newPagePerCategory) {
      doc.addPage();
      pageNum++;
      y = 26;
      await drawPageHeader(pageNum);
      drawFooter(pageNum);
    }
    firstCategory = false;

    // Título de categoría
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40);
    doc.text(`Categoría: ${catName}`, margin, y);
    y += 6;
    doc.setDrawColor(230);
    doc.line(margin, y, pageW - margin, y);
    y += 4;

    let processed = 0;
    for (const p of catProducts) {
      const thumb = 16;
      const gap = 4;
      const leftX = margin;
      const textX = leftX + (includeImages ? thumb + gap : 0);
      const textMaxW = pageW - margin - textX;

      const desc = p.descripcion?.trim() || "Sin descripción disponible.";
      const descLines = doc.splitTextToSize(desc, textMaxW);
      const blockH = Math.max(
        includeImages ? thumb : 0,
        4 + 6 + descLines.length * 4 + 4
      );

      if (y + blockH > pageH - margin) {
        doc.addPage();
        pageNum++;
        y = 26;
        await drawPageHeader(pageNum);
        drawFooter(pageNum);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(40, 40, 40);
        doc.text(`Categoría: ${catName} (cont.)`, margin, y);
        y += 6;
        doc.setDrawColor(230);
        doc.line(margin, y, pageW - margin, y);
        y += 4;
      }

      if (includeImages) {
        const dataUrl = imageDataMap.get(p.id);
        if (dataUrl) {
          try {
            const format = (dataUrl as string).startsWith("data:image/png")
              ? "PNG"
              : "JPEG";
            doc.setDrawColor(210);
            doc.rect(leftX, y, thumb, thumb);
            doc.addImage(
              dataUrl as string,
              format,
              leftX,
              y,
              thumb,
              thumb,
              undefined,
              "FAST"
            );
          } catch (err) {
            devDebug("addImage failed", err);
          }
        } else {
          doc.setDrawColor(210);
          doc.setFillColor(245, 245, 245);
          doc.rect(leftX, y, thumb, thumb, "FD");
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(130);
          doc.text("Sin\na\nimagen", leftX + 3, y + 5);
          doc.setTextColor(0);
        }
      }

      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(p.nombre || "Sin nombre", textX, y + 4);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(247, 181, 0);
      const priceStr = money(p.precio);
      const priceW = doc.getTextWidth(priceStr);
      doc.text(priceStr, pageW - margin - priceW, y + 4);
      doc.setTextColor(0);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(descLines, textX, y + 10);

      const yEnd = y + blockH;
      doc.setDrawColor(225);
      doc.line(margin, yEnd + 1, pageW - margin, yEnd + 1);
      y = yEnd + 4;

      processed++;
      if (isMobile && processed % 10 === 0) {
        await new Promise<void>((r) => setTimeout(r, 0));
      }
    }

    // Subtotal por categoría
    if (y + 10 > pageH - margin) {
      doc.addPage();
      pageNum++;
      y = 26;
      await drawPageHeader(pageNum);
      drawFooter(pageNum);
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(
      `Total de productos en ${catName}: ${catProducts.length}` as string,
      margin,
      y + 5
    );
    y += 12;

    globalTotal += catProducts.length;
  }

  if (y + 12 > pageH - margin) {
    doc.addPage();
    pageNum++;
    y = 26;
    await drawPageHeader(pageNum);
    drawFooter(pageNum);
  }
  doc.setDrawColor(210);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("Resumen general", margin, y);
  y += 6;
  doc.setTextColor(247, 181, 0);
  doc.text(`Total general de productos: ${globalTotal}`, margin, y);
  doc.setTextColor(0);

  doc.save("Lista_Precios_WeldZone.pdf");
}
