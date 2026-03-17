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
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <Radar
          name="Träffsäkerhet %"
          dataKey="accuracy"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.2}
          dot={{ r: 3, fill: '#8b5cf6' }}
        />
        <Tooltip
          formatter={(v: number) => [`${v}%`, 'Träffsäkerhet']}
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#e5e7eb',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
