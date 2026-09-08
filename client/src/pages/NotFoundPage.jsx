import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] px-4 text-center'>
      <div className='text-6xl font-bold text-[#2A2A2A] mb-4'>404</div>
      <h1 className='text-2xl font-semibold text-zinc-100 mb-2'>
        Page Not Found
      </h1>
      <p className='text-zinc-500 mb-8 max-w-sm'>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        to='/feed'
        className='px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors'
      >
        Return to Feed
      </Link>
    </div>
  );
};

export default NotFoundPage;
