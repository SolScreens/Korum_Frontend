interface Props {
  total: number;
  current: number; // 0-indexed
}

export default function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex gap-1.5 items-center justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? 'w-5 h-2 bg-brand-primary'
              : i < current
              ? 'w-2 h-2 bg-brand-primary opacity-40'
              : 'w-2 h-2 bg-border'
          }`}
        />
      ))}
    </div>
  );
}