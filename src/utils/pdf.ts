import jsPDF from "jspdf";
import type { Product } from "@/types/products";
import logoLight from "@/assets/logo-light.png";

/** Convierte una URL de imagen a DataURL */
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

/** Formatea número a moneda MXN */
function money(n: number): string {
  try {
    return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

type ExportOptions = {
  title?: string; // Título del documento (header de página)
  logoUrl?: string; // URL opcional del logo
  // Encabezado general (solo primera página)
  companyName?: string;
  rfc?: string;
  address?: string;
  phones?: string; // "474xxxx, 33xxxx"
  city?: string; // "Lagos de Moreno, Jal."
  showGeneralHeader?: boolean;
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

  // 🎨 Degradado dorado–naranja
  const gradientA = [247, 181, 0]; // #F7B500
  const gradientB = [255, 107, 0]; // #FF6B00

  function drawGradient(yStart: number, height: number) {
    const steps = 40;
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const r = gradientA[0] + t * (gradientB[0] - gradientA[0]);
      const g = gradientA[1] + t * (gradientB[1] - gradientA[1]);
      const b = gradientA[2] + t * (gradientB[2] - gradientA[2]);
      doc.setFillColor(r, g, b);
      doc.rect(0, yStart + (height / steps) * i, pageW, height / steps, "F");
    }
  }

  /** Header de página (degradado + logo + título + página) */
  const drawPageHeader = async (pageNum: number) => {
    drawGradient(0, 18);
    // Logo
    let logoData: string | null = null;
    try {
      const logoPath = opts.logoUrl ?? logoLight;
      logoData = await toDataURL(logoPath);
    } catch (err) {
      console.warn("No se pudo cargar el logo:", err);
    }
    if (logoData) {
      try {
        doc.addImage(logoData, "PNG", margin, 3, 22, 12, undefined, "FAST");
      } catch (err) {
        console.warn("Error insertando el logo:", err);
      }
    }

    // Título + número de página
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(title, margin + 28, 9);
    doc.setFontSize(9);
    doc.text(`Página ${pageNum}`, pageW - margin - 18, 9);
  };

  /** Footer con fecha y número de página */
  const drawFooter = (pageNum: number) => {
    const ts = new Date().toLocaleString("es-MX");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Generado: ${ts} | Página ${pageNum}`, margin, pageH - 6);
    doc.setTextColor(0);
  };

  /** Encabezado general (solo en la primera página) */
  /*
  const drawGeneralHeader = () => {
    const company = opts.companyName ?? "WELD ZONE";
    const rfc = opts.rfc ?? "R.F.C. WZO220810LH9";
    const address =
      opts.address ?? "Margarito González Rubio 1195 C, C.P. 37110";
    const phones = opts.phones ?? "4741178597, 4741129867";
    const city = opts.city ?? "Lagos de Moreno, Jalisco";
    const y0 = 22;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text("Lista de precios", margin, y0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(company, margin + 70, y0);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`${rfc}`, margin, y0 + 6);
    doc.text(`${address}`, margin, y0 + 11);
    doc.text(`${phones}  ${city}`, margin, y0 + 16);

    // Línea divisoria
    doc.setDrawColor(210);
    doc.line(margin, y0 + 20, pageW - margin, y0 + 20);
  };
  */
  // Encabezado general reintroducido con mejor composicion
  function drawGeneralInfo(): number {
    const company = opts.companyName ?? "WELD ZONE";
    const rfc = opts.rfc ?? "R.F.C. WZO220810LH9";
    const address =
      opts.address ?? "Margarito Gonzalez Rubio 1195 C, C.P. 37110";
    const phones = opts.phones ?? "4741178597, 4741129867";
    const city = opts.city ?? "Lagos de Moreno, Jalisco";

    // Box and columns
    const y0 = 22; // under gradient header
    const boxX = margin;
    const boxW = pageW - margin * 2;
    const gap = 6;
    const colW = (boxW - gap) / 2;
    const pad = 3;
    const leftX = boxX + pad;
    const rightX = boxX + colW + gap + pad;

    const toLines = (text: string, width: number): string[] => {
      const out = doc.splitTextToSize(text, width);
      return Array.isArray(out) ? out : [String(out)];
    };

    // Compute lines and height
    const leftLines = [
      ...toLines(`Direccion: ${address}`, colW - pad * 2),
      ...toLines(`Ciudad: ${city}`, colW - pad * 2),
    ];
    const rightLines = [
      ...toLines(`RFC: ${rfc}`, colW - pad * 2),
      ...toLines(`Tel: ${phones}`, colW - pad * 2),
    ];

    const titleH = 6;
    const lineH = 4;
    const maxLines = Math.max(leftLines.length, rightLines.length);
    const blockH = titleH + 2 + maxLines * lineH + 4; // top/bottom padding

    // Background box
    doc.setDrawColor(225);
    doc.setFillColor(250, 250, 250);
    doc.rect(boxX, y0 - 4, boxW, blockH, "FD");

    // Content
    let y = y0 + 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(company, leftX, y);

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);

    let yL = y;
    for (const ln of leftLines) {
      doc.text(ln, leftX, yL);
      yL += lineH;
    }

    let yR = y;
    for (const ln of rightLines) {
      doc.text(ln, rightX, yR);
      yR += lineH;
    }
    doc.setTextColor(0, 0, 0);

    const yEnd = y0 - 4 + blockH;
    doc.setDrawColor(210);
    doc.line(margin, yEnd, pageW - margin, yEnd);

    return yEnd + 4;
  }

  /** Asegura espacio; si no cabe, crea nueva página */
  async function ensureSpace(
    needed: number,
    state: { y: number; page: number }
  ) {
    if (state.y + needed > pageH - margin) {
      doc.addPage();
      state.page += 1;
      state.y = 26;
      await drawPageHeader(state.page);
      drawFooter(state.page);
    }
  }

  // 🔄 Precarga imágenes de productos (map por id)
  const imageDataMap = new Map<string | number, string | null>(
    await Promise.all(
      products.map(async (p) => {
        const dataUrl = p.imagenUrl ? await toDataURL(p.imagenUrl) : null;
        return [p.id, dataUrl] as const;
      })
    )
  );

  // 🗂️ Agrupar por categoría
  const grouped = products.reduce((acc, p) => {
    const cat = p.categoria?.nombre || "Sin categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  // ▶️ Comienzo
  let y = 26;
  let pageNum = 1;
  await drawPageHeader(pageNum);
  drawFooter(pageNum);

  // Encabezado general (solo primera página)
  // drawGeneralHeader(); // eliminado
  y = opts.showGeneralHeader === false ? 26 : drawGeneralInfo();

  let globalTotal = 0;

  // 🔹 Iterar categorías
  for (const [catName, catProducts] of Object.entries(grouped)) {
    // Título de categoría
    await ensureSpace(12, { y, page: pageNum }); // llamado con copia; actualizamos manualmente abajo
    if (y + 12 > pageH - margin) {
      doc.addPage();
      pageNum++;
      y = 26;
      await drawPageHeader(pageNum);
      drawFooter(pageNum);
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40);
    doc.text(`Categoría: ${catName}`, margin, y);
    y += 6;
    doc.setDrawColor(230);
    doc.line(margin, y, pageW - margin, y);
    y += 4;

    // Productos
    for (const p of catProducts) {
      const thumb = 16; // tamaño de mini imagen
      const gap = 4; // separación imagen-texto
      const leftX = margin;
      const textX = leftX + thumb + gap;
      const textMaxW = pageW - margin - textX;

      // Calcula altura estimada (nombre + precio + desc)
      const desc = p.descripcion?.trim() || "Sin descripción disponible.";
      const descLines = doc.splitTextToSize(desc, textMaxW);
      const blockH = Math.max(thumb, 4 + 6 + descLines.length * 4 + 4); // margen superior + nombre + desc + margen inferior

      // Salto de página si no cabe
      if (y + blockH > pageH - margin) {
        doc.addPage();
        pageNum++;
        y = 26;
        await drawPageHeader(pageNum);
        drawFooter(pageNum);
        // Repetir título de categoría si el bloque quedó partido
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(40, 40, 40);
        doc.text(`Categoría: ${catName} (cont.)`, margin, y);
        y += 6;
        doc.setDrawColor(230);
        doc.line(margin, y, pageW - margin, y);
        y += 4;
      }

      // Imagen (si existe)
      const dataUrl = imageDataMap.get(p.id);
      if (dataUrl) {
        try {
          const format = p.imagenUrl?.toLowerCase().endsWith(".png")
            ? "PNG"
            : "JPEG";
          // Marco gris de fondo (placeholder visual uniforme)
          doc.setDrawColor(210);
          doc.rect(leftX, y, thumb, thumb);
          doc.addImage(
            dataUrl,
            format,
            leftX,
            y,
            thumb,
            thumb,
            undefined,
            "FAST"
          );
        } catch (err) {
          console.warn(`Error insertando imagen de "${p.nombre}":`, err);
          // placeholder si falla
          doc.setDrawColor(210);
          doc.setFillColor(245, 245, 245);
          doc.rect(leftX, y, thumb, thumb, "FD");
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(130);
          doc.text("Sin\na\nimagen", leftX + 3, y + 5);
          doc.setTextColor(0);
        }
      } else {
        // placeholder si no hay dataUrl
        doc.setDrawColor(210);
        doc.setFillColor(245, 245, 245);
        doc.rect(leftX, y, thumb, thumb, "FD");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(130);
        doc.text("Sin\na\nimagen", leftX + 3, y + 5);
        doc.setTextColor(0);
      }

      // Texto (nombre, precio, descripción)
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(p.nombre || "Sin nombre", textX, y + 4);

      // Precio a la derecha del nombre (mismo renglón)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(247, 181, 0);
      const priceStr = money(p.precio);
      const priceW = doc.getTextWidth(priceStr);
      doc.text(priceStr, pageW - margin - priceW, y + 4);
      doc.setTextColor(0);

      // Descripción
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(descLines, textX, y + 10);

      // Separador del ítem
      const yEnd = y + blockH;
      doc.setDrawColor(225);
      doc.line(margin, yEnd + 1, pageW - margin, yEnd + 1);

      y = yEnd + 4; // espacio inferior
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
      `Total de productos en ${catName}: ${catProducts.length}`,
      margin,
      y + 5
    );
    y += 12;

    globalTotal += catProducts.length;
  }

  // Resumen general
  if (y + 16 > pageH - margin) {
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

  // Guardado
  doc.save("Lista_Precios_WeldZone.pdf");
}
