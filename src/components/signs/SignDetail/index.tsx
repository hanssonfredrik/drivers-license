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
        className="flex items-center gap-2 text-brand-600 hover:text-brand-800 text-sm font-medium"
        type="button"
      >
        ← Tillbaka
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg mx-auto sm:mx-0">
            {!imgError ? (
              <img
                src={imageUrl}
                alt={sign.name}
                className="w-full h-full object-contain p-2"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-xs text-gray-400 font-mono">{sign.id}</span>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <span className="text-xs font-mono text-gray-400">{sign.id}</span>
              <h2 className="text-xl font-bold text-gray-900 mt-0.5">{sign.name}</h2>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{sign.description}</p>

            {sign.relatedRule && (
              <div className="bg-brand-50 border border-brand-100 rounded-lg p-3">
                <p className="text-xs text-brand-700 font-semibold mb-1">Trafikregel</p>
                <p className="text-sm text-brand-800">{sign.relatedRule}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
