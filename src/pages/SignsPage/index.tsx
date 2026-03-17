import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { signCatalog } from '@/services/signCatalog';
import { SignCategoryList } from '@/components/signs/SignCategoryList';
import { SignCard } from '@/components/signs/SignCard';
import { SignDetail } from '@/components/signs/SignDetail';
import type { SignCategoryId, RoadSign } from '@/types/sign';
import { SIGN_CATEGORY_LABELS } from '@/types/sign';

type View = 'categories' | 'grid' | 'detail';

export default function SignsPage() {
  const { categoryId: category, signId } = useParams<{ categoryId?: string; signId?: string }>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<{ id: SignCategoryId; label: string; count: number }[]>([]);
  const [signs, setSigns] = useState<RoadSign[]>([]);
  const [selectedSign, setSelectedSign] = useState<RoadSign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<View>('categories');

  // Load categories on mount
  useEffect(() => {
    signCatalog.getCategories().then((cats) => {
      setCategories(cats);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  // Load signs when category changes
  useEffect(() => {
    if (!category) {
      setView('categories');
      setSigns([]);
      return;
    }
    setIsLoading(true);
    signCatalog.getByCategory(category as SignCategoryId).then((s) => {
      setSigns(s);
      setView('grid');
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [category]);

  // Load sign detail when signId changes
  useEffect(() => {
    if (!signId) {
      if (category) setView('grid');
      setSelectedSign(null);
      return;
    }
    signCatalog.getById(signId).then((s) => {
      if (s) {
        setSelectedSign(s);
        setView('detail');
      }
    }).catch(() => undefined);
  }, [signId, category]);

  const handleCategorySelect = (id: string) => {
    void navigate(`/signs/${id}`);
  };

  const handleSignSelect = (sign: RoadSign) => {
    void navigate(`/signs/${category}/${sign.id}`);
  };

  const handleBackToCategories = () => {
    void navigate('/signs');
  };

  const handleBackToGrid = () => {
    void navigate(`/signs/${category}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Laddar vägmärken…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        {view !== 'categories' && (
          <button
            onClick={view === 'detail' ? handleBackToGrid : handleBackToCategories}
            className="text-brand-600 hover:text-brand-800 text-sm font-medium"
            type="button"
          >
            ← Tillbaka
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">
          {view === 'categories' && 'Vägmärken'}
          {view === 'grid' && category && SIGN_CATEGORY_LABELS[category as SignCategoryId]}
          {view === 'detail' && selectedSign?.name}
        </h1>
      </div>

      {/* Content */}
      {view === 'categories' && (
        <SignCategoryList categories={categories} onSelect={handleCategorySelect} />
      )}

      {view === 'grid' && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {signs.length === 0 ? (
            <p className="col-span-full text-sm text-gray-500">
              Inga vägmärken i den här kategorin för tillfället.
            </p>
          ) : (
            signs.map((sign) => (
              <SignCard key={sign.id} sign={sign} onClick={() => handleSignSelect(sign)} />
            ))
          )}
        </div>
      )}

      {view === 'detail' && selectedSign && (
        <SignDetail sign={selectedSign} onBack={handleBackToGrid} />
      )}
    </div>
  );
}
