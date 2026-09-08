const Button = ({
  children,
  variant = "primary",
  isLoading,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-zinc-100 text-zinc-900 hover:bg-white focus:ring-zinc-500",
    secondary:
      "bg-[#222222] text-zinc-300 hover:bg-[#2A2A2A] border border-zinc-800 focus:ring-zinc-700",
    ghost:
      "bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#222222] focus:ring-zinc-800",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 focus:ring-red-500",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} px-4 py-2 text-sm ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className='animate-spin -ml-1 mr-2 h-4 w-4 text-current'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          ></circle>
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
