import useUiStore from "../../store/uiStore";

const Toast = () => {
  const { toasts, removeToast } = useUiStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2'>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className='bg-[#222222] border border-[#333333] text-zinc-200 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 min-w-70 animate-fade-in-up'
        >
          {toast.type === "success" && (
            <div className='w-2 h-2 rounded-full bg-emerald-500 shrink-0' />
          )}
          {toast.type === "error" && (
            <div className='w-2 h-2 rounded-full bg-red-500 shrink-0' />
          )}
          {toast.type === "info" && (
            <div className='w-2 h-2 rounded-full bg-blue-500 shrink-0' />
          )}
          <p className='text-sm flex-1'>{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className='text-zinc-500 hover:text-zinc-300 transition-colors'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              ></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
