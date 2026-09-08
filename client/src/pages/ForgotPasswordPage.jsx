import { Link } from "react-router-dom";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

const ForgotPasswordPage = () => {
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
            Reset Password
          </h1>
          <p className='text-sm text-zinc-400'>
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className='bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 shadow-2xl'>
          <ForgotPasswordForm />
        </div>

        <p className='text-center text-sm text-zinc-500 mt-6'>
          Remember your password?{" "}
          <Link
            to='/login'
            className='text-zinc-300 hover:text-white font-medium transition-colors'
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
