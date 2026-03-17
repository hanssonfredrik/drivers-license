import { useState } from 'react';
import { signCatalog } from '@/services/signCatalog';
import type { RoadSign } from '@/types/sign';

interface SignCardProps {
  sign: RoadSign;
  onClick?: () => void;
}

export function SignCard({ sign, onClick }: SignCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = signCatalog.getSignImageUrl(sign.id);

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-brand-500/40 hover:bg-brand-500/10 hover:shadow-glow-sm transition-all duration-200 text-center w-full"
      type="button"
    >
      <div className="w-16 h-16 flex items-center justify-center">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={sign.name}
            loading="lazy"
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5 rounded text-xs text-gray-500 font-mono">
            {sign.id}
          </div>
        )}
      </div>
      <span className="text-xs text-gray-300 leading-tight font-medium line-clamp-2">{sign.name}</span>
      <span className="text-[10px] text-gray-600 font-mono">{sign.id}</span>
    </button>
  );
}
