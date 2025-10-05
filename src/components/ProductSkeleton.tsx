// src/components/ProductSkeleton.tsx
export default function ProductSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-4 flex flex-col animate-pulse">
      <div className="w-full h-40 bg-zinc-200 dark:bg-zinc-700 rounded-lg mb-4" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6 mb-2" />
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 mb-4" />
      <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mt-auto" />
    </div>
  );
}
