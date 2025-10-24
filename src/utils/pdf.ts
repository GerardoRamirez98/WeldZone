import jsPDF from 'jspdf';
import type { Product } from '@/types/products';

async function toDataURL(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) || null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function money(n: number): string {
  try {
    return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

type ExportOptions = {
  title?: string;
  categoryName?: string;
};

export async function exportProductsPdf(products: Product[], opts: ExportOptions = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 12;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  let y = margin;

  const title = opts.title ?? 'Listado de Productos';
  const subtitle = opts.categoryName ? `Categoría: ${opts.categoryName}` : 'Todas las categorías';

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, margin, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(subtitle, margin, y);
  y += 8;

  const drawFooter = (pageNum: number) => {
    doc.setFontSize(9);
    doc.setTextColor(120);
    const ts = new Date().toLocaleString('es-MX');
    doc.text(`Generado: ${ts} - Página ${pageNum}`, margin, pageH - 6);
    doc.setTextColor(0);
  };

  let pageNum = 1;
  drawFooter(pageNum);

  for (const p of products) {
    // Ensure space, add page if needed
    const blockH = 40; // approximate height per item (image + text)
    if (y + blockH > pageH - margin) {
      doc.addPage();
      pageNum += 1;
      y = margin;
      drawFooter(pageNum);
    }

    // Image (optional)
    const imgSize = 28; // square image
    let imgDrawn = false;
    if (p.imagenUrl) {
      const dataUrl = await toDataURL(p.imagenUrl);
      if (dataUrl) {
        try {
          doc.addImage(dataUrl, 'JPEG', pageW - margin - imgSize, y, imgSize, imgSize, undefined, 'FAST');
          imgDrawn = true;
        } catch {
          // ignore image errors
        }
      }
    }

    // Text block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(p.nombre || 'Sin nombre', margin, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const cat = p.categoria?.nombre ? ` · ${p.categoria?.nombre}` : '';
    doc.text(`${money(p.precio)}${cat}`, margin, y + 10);

    const desc = p.descripcion?.trim() || 'Sin descripción';
    const maxTextW = imgDrawn ? pageW - margin * 2 - imgSize - 4 : pageW - margin * 2;
    const lines = doc.splitTextToSize(desc, maxTextW);
    const textY = y + 16;
    doc.text(lines, margin, textY);

    const usedH = Math.max(imgSize, (lines.length || 1) * 5 + 10);
    y += usedH + 8;
  }

  const fileName = opts.categoryName
    ? `Productos_${opts.categoryName.replace(/\s+/g, '_')}.pdf`
    : 'Productos_Todos.pdf';
  doc.save(fileName);
}

