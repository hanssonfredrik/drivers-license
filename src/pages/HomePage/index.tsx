import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { CATEGORY_LABELS } from '@/types/question';
import type { CategoryId } from '@/types/question';

const CATEGORY_ICONS: Record<CategoryId, string> = {
  trafikregler: '📋',
  trafiksakerhet: '🛡️',
  fordonskannedom: '🔧',
  miljo: '🌿',
  personliga: '🧠',
};

export default function HomePage() {
  const categories = Object.entries(CATEGORY_LABELS) as [CategoryId, string][];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🚗</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">B-Körkortsappen</h1>
        <p className="text-gray-500">Träna inför ditt körkortsprov — när och var du vill.</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link to="/quiz">
          <Card className="h-full hover:border-brand-300 hover:shadow-md transition-all cursor-pointer text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-semibold text-gray-900">Starta Quiz</div>
            <div className="text-xs text-gray-500 mt-1">65 frågor · 50 min</div>
          </Card>
        </Link>
        <Link to="/study">
          <Card className="h-full hover:border-brand-300 hover:shadow-md transition-all cursor-pointer text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="font-semibold text-gray-900">Instudering</div>
            <div className="text-xs text-gray-500 mt-1">Direktfeedback</div>
          </Card>
        </Link>
      </div>

      {/* Study by category */}
      <h2 className="text-base font-semibold text-gray-800 mb-3">Studera per ämne</h2>
      <div className="flex flex-col gap-2 mb-8">
        {categories.map(([id, label]) => (
          <Link key={id} to={`/study/${id}`}>
            <Card
              shadow={false}
              className="flex items-center gap-3 hover:border-brand-300 hover:bg-brand-50 transition-all cursor-pointer"
            >
              <span className="text-xl">{CATEGORY_ICONS[id]}</span>
              <span className="text-sm font-medium text-gray-800">{label}</span>
              <span className="ml-auto text-gray-400">→</span>
            </Card>
          </Link>
        ))}
      </div>

      {/* Secondary links */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/stats">
          <Card shadow={false} className="text-center hover:border-brand-200 transition-all cursor-pointer">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xs text-gray-600">Statistik</div>
          </Card>
        </Link>
        <Link to="/signs">
          <Card shadow={false} className="text-center hover:border-brand-200 transition-all cursor-pointer">
            <div className="text-2xl mb-1">🚧</div>
            <div className="text-xs text-gray-600">Skyltar</div>
          </Card>
        </Link>
        <Link to="/bookmarks">
          <Card shadow={false} className="text-center hover:border-brand-200 transition-all cursor-pointer">
            <div className="text-2xl mb-1">🔖</div>
            <div className="text-xs text-gray-600">Bokmärken</div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
