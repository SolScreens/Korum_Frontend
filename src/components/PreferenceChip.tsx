interface Props {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export default function PreferenceChip({ label, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        px-4 py-2 rounded-chip text-sm font-body font-medium
        transition-all duration-150 border
        ${
          selected
            ? 'bg-brand-primary text-white border-brand-primary'
            : 'bg-white text-[#6B6966] border-[#E4E2DC] hover:border-[#D44A20] hover:text-[#D44A20]'
        }
      `}
    >
      {label}
    </button>
  );
}