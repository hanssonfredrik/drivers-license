interface ExplanationProps {
  text: string;
  isCorrect: boolean;
}

export function Explanation({ text, isCorrect }: ExplanationProps) {
  return (
    <div
      className={`rounded-xl p-4 border-l-4 animate-fade-in ${
        isCorrect
          ? 'bg-success-50 border-success-500'
          : 'bg-danger-50 border-danger-500'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{isCorrect ? '✅' : '❌'}</span>
        <span
          className={`font-semibold text-sm ${
            isCorrect ? 'text-success-700' : 'text-danger-700'
          }`}
        >
          {isCorrect ? 'Rätt svar!' : 'Fel svar'}
        </span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}
