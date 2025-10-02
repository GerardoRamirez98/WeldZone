// src/admin/components/StatsCard.tsx
export default function StatsCard({
  title,
  value,
  color = "bg-yellow-500",
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow text-center">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <p
        className={`text-2xl font-bold text-white px-3 py-1 rounded-lg inline-block ${color}`}
      >
        {value}
      </p>
    </div>
  );
}
