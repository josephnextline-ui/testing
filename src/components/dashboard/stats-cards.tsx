interface Stat {
  label: string;
  value: string | number;
  change?: string;
}

interface StatsCardsProps {
  stats: Stat[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <p className="text-sm font-medium text-gray-500">{stat.label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
          {stat.change && (
            <p className="mt-1 text-xs text-green-600">{stat.change}</p>
          )}
        </div>
      ))}
    </div>
  );
}
