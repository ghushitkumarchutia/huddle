import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className='pt-32 pb-16 px-6 text-center max-w-4xl mx-auto'>
      <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2A2A] border border-[#333333] text-xs font-medium text-zinc-300 mb-8'>
        <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
        Huddle 1.0 is now live
      </div>
      <h1 className='text-5xl md:text-7xl font-semibold tracking-tight text-zinc-100 mb-6 leading-tight'>
        Your team's spaces, <br />
        <span className='text-zinc-500'>beautifully organized.</span>
      </h1>
      <p className='text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed'>
        A quiet, distraction-free environment for discussions, files, and deep
        work. No noise, no clutter, just what matters.
      </p>
      <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
        <Link
          to='/signup'
          className='w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium hover:bg-white transition-colors'
        >
          Get Started Free
        </Link>
        <Link
          to='/login'
          className='w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#222222] border border-[#2A2A2A] text-zinc-300 font-medium hover:bg-[#2A2A2A] hover:text-zinc-100 transition-colors'
        >
          Log In
        </Link>
      </div>
    </section>
  );
};

export default Hero;
