// src/admin/components/AdminImage.tsx
export default function AdminImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full h-32 flex items-center justify-center rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}
