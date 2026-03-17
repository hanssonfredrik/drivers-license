interface ExplanationProps {
  text: string;
  isCorrect: boolean;
}

export function Explanation({ text, isCorrect }: ExplanationProps) {
  return (
    <div
      className={`rounded-2xl p-4 border animate-fade-in ${
        isCorrect
          ? 'bg-success-500/10 border-success-500/30'
          : 'bg-danger-500/10 border-danger-500/30'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
          isCorrect ? 'bg-success-500 text-white' : 'bg-danger-500 text-white'
        }`}>
          {isCorrect ? '✓' : '✗'}
        </span>
        <span
          className={`font-semibold text-sm ${
            isCorrect ? 'text-success-400' : 'text-danger-400'
          }`}
        >
          {isCorrect ? 'Rätt svar!' : 'Fel svar'}
        </span>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
    </div>
  );
}
