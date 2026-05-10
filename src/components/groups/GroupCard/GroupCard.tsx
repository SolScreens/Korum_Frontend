import { useNavigate } from 'react-router-dom';
import type { Group } from '../../../types';
import MemberAvatarStack from '../MemberAvatarStack/MemberAvatarStack';

interface Props {
  group: Group;
}

export default function GroupCard({ group }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/groups/${group.id}`)}
      className="w-full text-left bg-card rounded-card p-5 border border-border hover:border-border-warm hover:shadow-sm transition-all duration-150 active:scale-[0.99]"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h3 className="font-heading font-semibold text-ink text-lg truncate">
            {group.name}
          </h3>
          <p className="font-body text-sm text-ink-muted mt-0.5">
            {group.members.length} member{group.members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <MemberAvatarStack members={group.members} max={3} />
      </div>
    </button>
  );
}
