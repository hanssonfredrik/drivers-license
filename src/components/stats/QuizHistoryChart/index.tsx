import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import type { QuizSession } from '@/types/quiz';

interface QuizHistoryChartProps {
  history: QuizSession[];
}

export function QuizHistoryChart({ history }: QuizHistoryChartProps) {
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
        Inga quiz avslutade ännu.
      </div>
    );
  }

  const data = history
    .slice(-20)
    .map((session, idx) => ({
      label: `#${idx + 1}`,
      score: session.score ?? 0,
      passed: (session.score ?? 0) >= 52,
    }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 65]} tick={{ fontSize: 10 }} />
        <Tooltip
          formatter={(v: number) => [`${v} av 65`, 'Poäng']}
          labelFormatter={(l: string) => `Quiz ${l}`}
        />
        <ReferenceLine y={52} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Godkänt', position: 'right', fontSize: 10, fill: '#22c55e' }} />
        <Bar
          dataKey="score"
          radius={[3, 3, 0, 0]}
          fill="#1d4ed8"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
