import type { RoomStatus } from '../../../types';

interface Props {
  status: RoomStatus;
  className?: string;
}

const config: Record<RoomStatus, { label: string; className: string; dot: string }> = {
  collecting: {
    label: 'Collecting',
    className: 'bg-tint-primary text-ink-secondary border border-border',
    dot: 'bg-ink-muted',
  },
  swiping: {
    label: 'Swiping',
    className: 'bg-brand-primary text-white border border-brand-primary',
    dot: 'bg-white',
  },
  done: {
    label: 'Done',
    className: 'bg-tint-success text-ink border border-brand-secondary',
    dot: 'bg-brand-secondary',
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