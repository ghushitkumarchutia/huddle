const EmptyState = ({ icon, message, action }) => {
  return (
    <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
      <div className='w-12 h-12 rounded-full bg-[#1E1E1E] flex items-center justify-center text-zinc-500 mb-4 border border-[#2A2A2A]'>
        {icon || (
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
              d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
            ></path>
          </svg>
        )}
      </div>
      <p className='text-sm text-zinc-400 mb-4'>{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
