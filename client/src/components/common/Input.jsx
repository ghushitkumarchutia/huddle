import { forwardRef } from "react";

const Input = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className='w-full'>
      {label && (
        <label className='block text-xs font-medium text-zinc-400 mb-1.5'>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full bg-[#1A1A1A] text-zinc-200 border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 placeholder-zinc-600 transition-colors ${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className='mt-1.5 text-xs text-red-500'>{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
