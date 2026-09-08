const Footer = () => {
  return (
    <footer className='py-8 px-6 border-t border-[#2A2A2A] bg-[#121212] mt-auto'>
      <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='flex items-center gap-2 text-zinc-100 font-semibold tracking-tight'>
          <svg
            className='w-4 h-4 text-zinc-400'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'></path>
          </svg>
          Huddle
        </div>

        <div className='flex items-center gap-6 text-sm text-zinc-500'>
          <a href='#' className='hover:text-zinc-300 transition-colors'>
            About
          </a>
          <a href='#' className='hover:text-zinc-300 transition-colors'>
            Contact
          </a>
          <a
            href='https://github.com'
            target='_blank'
            rel='noreferrer'
            className='hover:text-zinc-300 transition-colors'
          >
            GitHub
          </a>
        </div>

        <div className='text-xs text-zinc-600'>
          &copy; {new Date().getFullYear()} Huddle. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
