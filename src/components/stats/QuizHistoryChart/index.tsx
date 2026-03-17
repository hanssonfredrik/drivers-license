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
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} />
        <YAxis domain={[0, 65]} tick={{ fontSize: 10, fill: '#6b7280' }} />
        <Tooltip
          formatter={(v: number) => [`${v} av 65`, 'Poäng']}
          labelFormatter={(l: string) => `Quiz ${l}`}
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#e5e7eb',
          }}
        />
        <ReferenceLine y={52} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Godkänt', position: 'right', fontSize: 10, fill: '#10b981' }} />
        <Bar
          dataKey="score"
          radius={[4, 4, 0, 0]}
          fill="url(#barGradient)"
        />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
