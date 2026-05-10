import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGroups } from '../hooks/useGroups';
import GroupCard from '../components/GroupCard';
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
    <div className="min-h-screen bg-[#FFF8F5]">
      {/* Header */}
      <header className="bg-white border-b border-[#E4E2DC] sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-heading font-semibold text-2xl text-[#2A1200]">
            Korum
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-[#9A7060] hidden sm:block">
              {user?.display_name}
            </span>
            <button
              onClick={logout}
              className="font-body text-sm text-[#6B6966] hover:text-brand-primary transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-xl text-[#2A1200]">
            Your groups
          </h2>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-btn bg-brand-primary text-white font-body text-sm font-medium hover:bg-[#FF7A45] transition-colors"
          >
            + New group
          </button>
        </div>

        {/* Create group form */}
        {showCreate && (
          <div className="bg-white rounded-card border border-[#EAD8CE] p-5 mb-4 shadow-sm">
            <h3 className="font-heading font-semibold text-lg text-[#2A1200] mb-4">
              New group
            </h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block font-body text-sm font-medium text-[#2A1200] mb-1.5">
                  Group name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  placeholder="Movie night crew"
                  className="w-full px-4 py-3 rounded-[14px] border border-[#EAD8CE] bg-[#FFF8F5] font-body text-sm text-[#2A1200] placeholder:text-[#9A7060] focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-[#2A1200] mb-1.5">
                  Invite members{' '}
                  <span className="text-[#9A7060] font-normal">(emails, comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={memberEmails}
                  onChange={(e) => setMemberEmails(e.target.value)}
                  placeholder="friend@example.com, other@example.com"
                  className="w-full px-4 py-3 rounded-[14px] border border-[#EAD8CE] bg-[#FFF8F5] font-body text-sm text-[#2A1200] placeholder:text-[#9A7060] focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>

              {error && (
                <p className="font-body text-sm text-red-500">{error}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-btn border border-[#E4E2DC] font-body text-sm font-medium text-[#6B6966] hover:bg-[#F8F7F4] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-btn bg-brand-primary text-white font-body text-sm font-medium hover:bg-[#FF7A45] disabled:opacity-60 transition-colors"
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
                className="bg-card rounded-card h-20 border border-[#E4E2DC] animate-pulse"
              />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="font-heading font-semibold text-lg text-[#2A1200]">
              No groups yet
            </h3>
            <p className="font-body text-sm text-[#9A7060] mt-1">
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