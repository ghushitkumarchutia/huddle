import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Avatar from "../common/Avatar";

const Navbar = () => {
  const { user } = useAuthStore();

  return (
    <nav className='sticky top-0 z-40 bg-[#121212]/80 backdrop-blur-md border-b border-[#2A2A2A] h-14 flex items-center px-6'>
      <div className='flex-1 flex items-center gap-4'>
        <Link
          to='/'
          className='text-zinc-100 font-semibold tracking-tight text-lg flex items-center gap-2'
        >
          <svg
            className='w-5 h-5 text-zinc-400'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'></path>
          </svg>
          Huddle
        </Link>
      </div>

      <div className='flex items-center gap-4'>
        <button className='w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-[#2A2A2A] transition-colors'>
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
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            ></path>
          </svg>
        </button>
        <button className='w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-[#2A2A2A] transition-colors relative'>
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
              d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
            ></path>
          </svg>
          <span className='absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-[#121212]'></span>
        </button>
        <div className='h-4 w-px bg-[#2A2A2A] mx-1'></div>
        {user && (
          <Avatar src={user.avatarUrl} alt={user.displayName} size='sm' />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
