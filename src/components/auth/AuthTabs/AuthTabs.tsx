interface Props {
  activeTab: 'login' | 'signup';
  onChange: (tab: 'login' | 'signup') => void;
}

const labels: Record<'login' | 'signup', string> = {
  login: 'Log in',
  signup: 'Sign up',
};

export default function AuthTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex p-1 bg-border rounded-chip">
      {(['login', 'signup'] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`
            flex-1 py-2.5 rounded-chip text-sm font-body font-medium
            transition-all duration-200
            ${activeTab === tab
              ? 'bg-white text-brand-primary shadow-sm'
              : 'text-ink-muted hover:text-ink-secondary'
            }
          `}
        >
          {labels[tab]}
        </button>
      ))}
    </div>
  );
}
