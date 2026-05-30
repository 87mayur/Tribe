export function Button({ className = '', variant, children, disabled, ...props }) {
  return (
    <button
      className={`rounded-xl px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
