import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_LABELS, CategoryId } from '@/types/question';
import type { CategoryAccuracy } from '@/types/progress';

interface CategoryChartProps {
  categoryAccuracy: Record<CategoryId, CategoryAccuracy>;
}

export function CategoryChart({ categoryAccuracy }: CategoryChartProps) {
  const data = (Object.keys(categoryAccuracy) as CategoryId[]).map((cat) => {
    const acc = categoryAccuracy[cat];
    const rate = acc.total === 0 ? 0 : Math.round((acc.correct / acc.total) * 100);
    return { category: CATEGORY_LABELS[cat], accuracy: rate };
  });

  const hasData = data.some((d) => d.accuracy > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        Inga studieresultat ännu.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
        <Radar
          name="Träffsäkerhet %"
          dataKey="accuracy"
          stroke="#1d4ed8"
          fill="#1d4ed8"
          fillOpacity={0.25}
          dot={{ r: 3 }}
        />
        <Tooltip formatter={(v: number) => [`${v}%`, 'Träffsäkerhet']} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
