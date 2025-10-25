import type { ReactNode } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type GetColumnCount = (containerWidth: number) => number;

export type VirtualGridProps<T> = {
  items: T[];
  render: (item: T, index: number) => ReactNode;
  itemKey?: (item: T, index: number) => string | number;
  gap?: number; // px
  estimateRowHeight?: (cellWidth: number) => number; // px
  getColumnCount?: GetColumnCount; // responsive columns
  className?: string;
};

const defaultGetColumns: GetColumnCount = (w: number) => {
  if (w >= 1280) return 4; // xl
  if (w >= 1024) return 3; // lg
  if (w >= 640) return 2; // sm
  return 1;
};

export function VirtualGrid<T>({
  items,
  render,
  itemKey,
  gap = 24,
  estimateRowHeight = (cw) => Math.max(300, Math.min(540, Math.round(cw + 140))),
  getColumnCount = defaultGetColumns,
  className,
}: VirtualGridProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState({ width: 0, height: 600, top: 0 });
  const [scrollTop, setScrollTop] = useState(0);

  // Measure size and position
  const recalc = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const height = Math.max(300, Math.floor(window.innerHeight - rect.top - 24));
    const width = Math.floor(el.clientWidth);
    setContainer({ width, height, top: rect.top });
  }, []);

  useLayoutEffect(() => {
    recalc();
  }, [recalc]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => recalc());
    ro.observe(el);
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [recalc]);

  const cols = useMemo(() => Math.max(1, getColumnCount(container.width)), [container.width, getColumnCount]);
  const cellWidth = useMemo(() => {
    const totalGap = gap * (cols - 1);
    return Math.max(120, Math.floor((container.width - totalGap) / cols));
  }, [container.width, cols, gap]);
  const rowHeight = useMemo(() => estimateRowHeight(cellWidth), [cellWidth, estimateRowHeight]);
  const totalRows = useMemo(() => Math.ceil(items.length / cols), [items.length, cols]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop);
  };

  const overscan = 2;
  const startRow = Math.max(0, Math.floor(scrollTop / (rowHeight + gap)) - overscan);
  const endRow = Math.min(totalRows - 1, Math.ceil((scrollTop + container.height) / (rowHeight + gap)) + overscan);

  const children: ReactNode[] = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      if (index >= items.length) break;
      const item = items[index];
      const left = col * (cellWidth + gap);
      const top = row * (rowHeight + gap);
      const key = itemKey ? itemKey(item, index) : index;
      children.push(
        <div
          key={key}
          style={{ position: "absolute", left, top, width: cellWidth, height: rowHeight }}
        >
          {render(item, index)}
        </div>
      );
    }
  }

  const contentHeight = totalRows * (rowHeight + gap) - gap;

  return (
    <div ref={scrollRef} className={className} style={{ position: "relative", height: container.height, overflowY: "auto" }} onScroll={onScroll}>
      <div style={{ position: "relative", height: contentHeight, width: container.width }}>
        {children}
      </div>
    </div>
  );
}

export default VirtualGrid;
