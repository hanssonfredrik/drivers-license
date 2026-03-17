import { Card } from '@/components/common/Card';
import { CategoryChart } from '@/components/stats/CategoryChart';
import { QuizHistoryChart } from '@/components/stats/QuizHistoryChart';
import { StreakDisplay } from '@/components/stats/StreakDisplay';
import { XpLevelBar } from '@/components/stats/XpLevelBar';
import { BadgeGrid } from '@/components/stats/BadgeGrid';
import { useProgress } from '@/hooks/useProgress';
import { useGamification } from '@/hooks/useGamification';

export default function StatsPage() {
  const { progress, quizHistory, isLoading: progressLoading } = useProgress();
  const { state, badges, earnedBadgeIds, isLoading: gamLoading } = useGamification();

  const isLoading = progressLoading || gamLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Laddar statistik…
      </div>
    );
  }

  const passedCount = quizHistory.filter((s) => (s.score ?? 0) >= 52).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Statistik</h1>

      {/* XP & Level */}
      {state && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-200">Nivå & XP</h2>
              <span className="text-sm text-gray-500 font-mono">{state.totalXp} XP</span>
            </div>
            <XpLevelBar totalXp={state.totalXp} level={state.level} />
          </div>
        </Card>
      )}

      {/* Streak */}
      {progress && (
        <Card>
          <h2 className="text-base font-semibold text-gray-200 mb-3">Streak</h2>
          <StreakDisplay
            currentStreak={progress.currentStreak}
            longestStreak={progress.longestStreak}
          />
        </Card>
      )}

      {/* Summary numbers */}
      {progress && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <div className="text-3xl font-bold text-gradient">{progress.totalAnswered}</div>
            <div className="text-xs text-gray-500 mt-1">Svar totalt</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-success-400">{passedCount}</div>
            <div className="text-xs text-gray-500 mt-1">Godkända quiz</div>
          </Card>
        </div>
      )}

      {/* Category radar */}
      {progress && (
        <Card>
          <h2 className="text-base font-semibold text-gray-200 mb-3">Träffsäkerhet per kategori</h2>
          <CategoryChart categoryAccuracy={progress.categoryAccuracy} />
        </Card>
      )}

      {/* Quiz history bar chart */}
      <Card>
        <h2 className="text-base font-semibold text-gray-200 mb-3">Quiz-historia</h2>
        <QuizHistoryChart history={quizHistory} />
      </Card>

      {/* Badges */}
      <Card>
        <h2 className="text-base font-semibold text-gray-200 mb-3">Märken</h2>
        <BadgeGrid badges={badges} earnedBadgeIds={earnedBadgeIds} />
      </Card>
    </div>
  );
}
