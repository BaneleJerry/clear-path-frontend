
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";

  const variants = {
    primary: "bg-primary text-white hover:bg-blue-600",
    secondary: "bg-surface border border-border text-textPrimary hover:bg-gray-50",
    ghost: "text-textPrimary hover:bg-gray-100",
    danger: "bg-error text-white hover:bg-red-600"
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}