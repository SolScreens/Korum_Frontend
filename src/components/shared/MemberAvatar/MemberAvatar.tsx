import type { User } from '../../../types';

interface Props {
  user: Pick<User, 'display_name' | 'avatar_url'>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

// Deterministic color from name — palette-derived dark shades, all readable with white text
const colors = [
  'bg-[#231123]', // midnight_violet
  'bg-[#82204a]', // dark_raspberry
  'bg-[#602e60]', // midnight_violet.600
  'bg-[#335353]', // dark_cyan.300
  'bg-[#4e142d]', // dark_raspberry.300
  'bg-[#446f6f]', // dark_cyan.400
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function MemberAvatar({ user, size = 'md', className = '' }: Props) {
  const name = user?.display_name || '?';
  const color = getColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={`
        ${sizes[size]} ${color} ${className}
        rounded-full flex items-center justify-center
        font-heading font-semibold text-white shrink-0
      `}
      title={user.display_name}
    >
      {initials}
    </div>
  );
}