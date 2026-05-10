import type { RoomStatus } from '../types';

interface Props {
  status: RoomStatus;
  className?: string;
}

const config: Record<RoomStatus, { label: string; className: string; dot: string }> = {
  collecting: {
    label: 'Collecting',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-400',
  },
  swiping: {
    label: 'Swiping',
    className: 'bg-orange-50 text-brand-primary border border-orange-200',
    dot: 'bg-brand-primary',
  },
  done: {
    label: 'Done',
    className: 'bg-green-50 text-green-700 border border-green-200',
    dot: 'bg-green-500',
  },
};

export default function StatusBadge({ status, className = '' }: Props) {
  const { label, className: base, dot } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-chip text-xs font-body font-medium ${base} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}