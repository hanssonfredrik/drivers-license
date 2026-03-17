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
      className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-brand-400 hover:shadow-sm transition-all text-center w-full"
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
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded text-xs text-gray-400 font-mono">
            {sign.id}
          </div>
        )}
      </div>
      <span className="text-xs text-gray-700 leading-tight font-medium line-clamp-2">{sign.name}</span>
      <span className="text-[10px] text-gray-400 font-mono">{sign.id}</span>
    </button>
  );
}
