import { useState } from 'react';
import { signCatalog } from '@/services/signCatalog';
import type { RoadSign } from '@/types/sign';

interface SignDetailProps {
  sign: RoadSign;
  onBack: () => void;
}

export function SignDetail({ sign, onBack }: SignDetailProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = signCatalog.getSignImageUrl(sign.id);

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
        type="button"
      >
        ← Tillbaka
      </button>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center bg-white/5 rounded-xl mx-auto sm:mx-0">
            {!imgError ? (
              <img
                src={imageUrl}
                alt={sign.name}
                className="w-full h-full object-contain p-2"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-xs text-gray-500 font-mono">{sign.id}</span>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <span className="text-xs font-mono text-gray-500">{sign.id}</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{sign.name}</h2>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">{sign.description}</p>

            {sign.relatedRule && (
              <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3">
                <p className="text-xs text-brand-400 font-semibold mb-1">Trafikregel</p>
                <p className="text-sm text-gray-200">{sign.relatedRule}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
