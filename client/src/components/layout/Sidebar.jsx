import { Link } from "react-router-dom";
import useUiStore from "../../store/uiStore";

const Sidebar = () => {
  const { activeSpaceId } = useUiStore();

  return (
    <aside className='w-64 border-r border-[#2A2A2A] bg-[#151515] h-[calc(100vh-3.5rem)] overflow-y-auto flex flex-col'>
      <div className='p-4'>
        <div className='text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-3'>
          Main
        </div>
        <div className='space-y-1'>
          <Link
            to='/'
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${!activeSpaceId ? "bg-[#2A2A2A] text-zinc-100" : "text-zinc-400 hover:bg-[#222222] hover:text-zinc-200"}`}
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
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              ></path>
            </svg>
            Dashboard
          </Link>
          <Link
            to='/spaces'
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeSpaceId ? "bg-[#2A2A2A] text-zinc-100" : "text-zinc-400 hover:bg-[#222222] hover:text-zinc-200"}`}
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
                d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
              ></path>
            </svg>
            Spaces
            <span className='ml-auto bg-[#2A2A2A] text-zinc-300 text-[10px] px-1.5 py-0.5 rounded border border-[#333333]'>
              New
            </span>
          </Link>
        </div>
      </div>
      <div className='p-4 mt-auto'>
        <div className='bg-[#1E1E1E] rounded-xl p-4 border border-[#2A2A2A] relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-zinc-700/10 to-transparent rounded-bl-full pointer-events-none'></div>
          <div className='w-8 h-8 rounded-lg bg-linear-to-br from-[#333333] to-[#222222] flex items-center justify-center border border-[#444444] mb-3'>
            <svg
              className='w-4 h-4 text-zinc-300'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'></path>
            </svg>
          </div>
          <h4 className='text-sm font-medium text-zinc-200 mb-1'>
            Upgrade to Pro!
          </h4>
          <p className='text-[11px] text-zinc-500 mb-3 leading-relaxed'>
            Unlock Premium Features and Manage Unlimited spaces
          </p>
          <button className='w-full bg-[#2A2A2A] hover:bg-[#333333] text-zinc-200 text-xs font-medium py-2 rounded-lg border border-[#444444] transition-colors'>
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
