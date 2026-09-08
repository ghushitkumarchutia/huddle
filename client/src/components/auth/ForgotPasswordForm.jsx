import { useState } from "react";
import { forgotPassword } from "../../api/auth.api";
import Input from "../common/Input";
import Button from "../common/Button";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await forgotPassword({ email });
    } catch (err) {
      // Intentionally ignore the error per Section 6.3 generic response pattern
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className='w-full p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-center'>
        <div className='w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 13l4 4L19 7'
            ></path>
          </svg>
        </div>
        <h3 className='text-zinc-100 font-medium mb-2'>Check your email</h3>
        <p className='text-sm text-zinc-400'>
          If an account exists for {email}, we've sent instructions for
          resetting your password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 w-full'>
      <Input
        label='Email'
        name='email'
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='jane@example.com'
        required
      />

      <Button type='submit' className='w-full mt-6' isLoading={isSubmitting}>
        Send Reset Link
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
