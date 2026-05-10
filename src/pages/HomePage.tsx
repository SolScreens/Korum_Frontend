import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGroups } from '../hooks/useGroups';
import GroupCard from '../components/groups/GroupCard/GroupCard';
import { getErrorMessage } from '../lib/api';

export default function HomePage() {
  const { user, logout } = useAuth();
  const { groups, isLoading, createGroup } = useGroups();

  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const emails = memberEmails
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
      await createGroup({ name: groupName.trim(), member_emails: emails });
      setGroupName('');
      setMemberEmails('');
      setShowCreate(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-heading font-semibold text-2xl text-ink">
            Korum
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-ink-muted hidden sm:block">
              {user?.display_name}
            </span>
            <button
              onClick={logout}
              className="font-body text-sm text-ink-secondary hover:text-brand-primary transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-xl text-ink">
            Your groups
          </h2>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-btn bg-brand-primary text-white font-body text-sm font-medium hover:bg-brand-hover transition-colors"
          >
            + New group
          </button>
        </div>

        {/* Create group form */}
        {showCreate && (
          <div className="bg-white rounded-card border border-border-warm p-5 mb-4 shadow-sm">
            <h3 className="font-heading font-semibold text-lg text-ink mb-4">
              New group
            </h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block font-body text-sm font-medium text-ink mb-1.5">
                  Group name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  placeholder="Movie night crew"
                  className="w-full px-4 py-3 rounded-[14px] border border-border-warm bg-page font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-ink mb-1.5">
                  Invite members{' '}
                  <span className="text-ink-muted font-normal">(emails, comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={memberEmails}
                  onChange={(e) => setMemberEmails(e.target.value)}
                  placeholder="friend@example.com, other@example.com"
                  className="w-full px-4 py-3 rounded-[14px] border border-border-warm bg-page font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>

              {error && (
                <p className="font-body text-sm text-red-500">{error}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-btn border border-border font-body text-sm font-medium text-ink-secondary hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-btn bg-brand-primary text-white font-body text-sm font-medium hover:bg-brand-hover disabled:opacity-60 transition-colors"
                >
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Groups list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-card h-20 border border-border animate-pulse"
              />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="font-heading font-semibold text-lg text-ink">
              No groups yet
            </h3>
            <p className="font-body text-sm text-ink-muted mt-1">
              Create a group and invite your friends to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}