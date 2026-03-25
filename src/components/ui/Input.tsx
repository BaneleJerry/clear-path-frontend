type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-textSecondary">{label}</label>
      )}
      <input
        className="px-3 py-2 rounded-lg border border-border bg-surface 
                   text-textPrimary outline-none 
                   focus:ring-2 focus:ring-primary"
        {...props}
      />
    </div>
  );
}