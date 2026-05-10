import MemberAvatar from './MemberAvatar';
import type { GroupMember } from '../types';

interface Props {
  members: GroupMember[];
  max?: number;
}

export default function MemberAvatarStack({ members, max = 4 }: Props) {
  const visible = members.slice(0, max);
  const overflow = members.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((m) => (
        <MemberAvatar
          key={m.user_id}
          user={m.user}
          size="sm"
          className="ring-2 ring-white"
        />
      ))}
      {overflow > 0 && (
        <div className="w-8 h-8 rounded-full bg-[#E4E2DC] ring-2 ring-white flex items-center justify-center text-xs font-body font-medium text-[#6B6966]">
          +{overflow}
        </div>
      )}
    </div>
  );
}