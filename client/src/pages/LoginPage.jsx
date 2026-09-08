import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className='min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4 font-sans selection:bg-zinc-700 selection:text-white'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <Link
            to='/'
            className='inline-flex items-center gap-2 text-zinc-100 font-semibold tracking-tight text-xl mb-6 hover:opacity-80 transition-opacity'
          >
            <svg
              className='w-6 h-6 text-zinc-400'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'></path>
            </svg>
            Huddle
          </Link>
          <h1 className='text-2xl font-medium text-zinc-100 mb-2'>
            Welcome back
          </h1>
          <p className='text-sm text-zinc-400'>
            Log in to your Huddle account.
          </p>
        </div>

        <div className='bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 shadow-2xl'>
          <LoginForm />

          <div className='mt-4 text-center'>
            <Link
              to='/forgot-password'
              className='text-xs text-zinc-500 hover:text-zinc-300 transition-colors'
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <p className='text-center text-sm text-zinc-500 mt-6'>
          Don't have an account?{" "}
          <Link
            to='/signup'
            className='text-zinc-300 hover:text-white font-medium transition-colors'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
