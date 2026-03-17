interface SignCategoryListProps {
  categories: { id: string; label: string; count: number }[];
  onSelect: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  varningstecken: '⚠️',
  vagrättstecken: '⛔',
  förbudsmärken: '🚫',
  påbudsmärken: '🔵',
  anvisningsmärken: 'ℹ️',
  vägvisare: '🗺️',
  upplysningsskyltar: '📋',
  vägmärkeskombinationer: '🔣',
};

export function SignCategoryList({ categories, onSelect }: SignCategoryListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-400 hover:bg-brand-50 transition-all text-left"
          type="button"
        >
          <span className="text-2xl">{CATEGORY_ICONS[cat.id] ?? '🚦'}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 capitalize">{cat.label}</p>
            <p className="text-xs text-gray-500">{cat.count} skyltar</p>
          </div>
          <span className="text-gray-400">›</span>
        </button>
      ))}
    </div>
  );
}
