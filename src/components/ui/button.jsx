export function Button({ className = '', variant, children, disabled, ...props }) {
  const disabledClass = disabled ? ' cursor-not-allowed opacity-50' : ''
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${className}${disabledClass}`}
      {...props}
    >
      {children}
    </button>
  )
}
