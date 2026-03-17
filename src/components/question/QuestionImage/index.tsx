interface QuestionImageProps {
  imageId: string;
  alt: string;
}

export function QuestionImage({ imageId, alt }: QuestionImageProps) {
  const src = new URL(`../../../data/signs/svg/${imageId}.svg`, import.meta.url).href;

  return (
    <div className="flex justify-center">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="max-h-48 w-auto object-contain rounded-lg border border-gray-100"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}
