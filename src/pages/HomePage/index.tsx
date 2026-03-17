import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { CATEGORY_LABELS } from '@/types/question';
import type { CategoryId } from '@/types/question';

const CATEGORY_ICONS: Record<CategoryId, string> = {
  trafikregler: '⚡',
  trafiksakerhet: '🛡️',
  fordonskannedom: '⚙️',
  miljo: '🌱',
  personliga: '🧠',
};

const CATEGORY_COLORS: Record<CategoryId, string> = {
  trafikregler: 'from-brand-600/20 to-brand-500/5 border-brand-500/20 hover:border-brand-400/40',
  trafiksakerhet: 'from-accent-500/20 to-accent-400/5 border-accent-500/20 hover:border-accent-400/40',
  fordonskannedom: 'from-warning-500/20 to-warning-400/5 border-warning-500/20 hover:border-warning-400/40',
  miljo: 'from-success-500/20 to-success-400/5 border-success-500/20 hover:border-success-400/40',
  personliga: 'from-xp-500/20 to-xp-400/5 border-xp-500/20 hover:border-xp-400/40',
};

export default function HomePage() {
  const categories = Object.entries(CATEGORY_LABELS) as [CategoryId, string][];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
      {/* Hero */}
      <div className="relative text-center mb-10 py-8">
        {/* Glow background */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-accent-500/15 rounded-full blur-[60px]" />
        </div>
        <div className="text-6xl mb-4 animate-float">🏎️</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          Redo att <span className="text-gradient">köra?</span>
        </h1>
        <p className="text-gray-400 text-base max-w-sm mx-auto">
          Träna inför körkortsteori — snabbt, smart och överallt.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        <Link to="/quiz" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 p-5 transition-all duration-300 group-hover:shadow-glow group-hover:scale-[1.02]">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="relative">
              <div className="text-3xl mb-3">⚡</div>
              <div className="font-bold text-white text-lg">Starta Quiz</div>
              <div className="text-xs text-brand-200 mt-1">65 frågor · 50 min</div>
            </div>
          </div>
        </Link>
        <Link to="/study" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-600 to-accent-500 p-5 transition-all duration-300 group-hover:shadow-glow-cyan group-hover:scale-[1.02]">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="relative">
              <div className="text-3xl mb-3">📖</div>
              <div className="font-bold text-white text-lg">Instudering</div>
              <div className="text-xs text-cyan-200 mt-1">Direktfeedback</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Study by category */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Studera per ämne</h2>
        <div className="flex flex-col gap-2">
          {categories.map(([id, label]) => (
            <Link key={id} to={`/study/${id}`} className="group">
              <div
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl bg-gradient-to-r border transition-all duration-200 group-hover:translate-x-1 ${CATEGORY_COLORS[id]}`}
              >
                <span className="text-xl">{CATEGORY_ICONS[id]}</span>
                <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{label}</span>
                <span className="ml-auto text-gray-500 group-hover:text-gray-300 transition-colors text-sm">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Secondary links */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/stats" className="group">
          <Card shadow={false} className="text-center transition-all duration-200 group-hover:bg-white/8 group-hover:border-white/20">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">Statistik</div>
          </Card>
        </Link>
        <Link to="/signs" className="group">
          <Card shadow={false} className="text-center transition-all duration-200 group-hover:bg-white/8 group-hover:border-white/20">
            <div className="text-2xl mb-2">🚦</div>
            <div className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">Skyltar</div>
          </Card>
        </Link>
        <Link to="/bookmarks" className="group">
          <Card shadow={false} className="text-center transition-all duration-200 group-hover:bg-white/8 group-hover:border-white/20">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">Bokmärken</div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
