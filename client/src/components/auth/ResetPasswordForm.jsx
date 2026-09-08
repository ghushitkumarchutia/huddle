import { useState } from "react";
import { resetPassword } from "../../api/auth.api";
import Input from "../common/Input";
import Button from "../common/Button";

const ResetPasswordForm = ({ token }) => {
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await resetPassword({ token, newPassword });
      setIsSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. The link might be invalid or expired.",
      );
    } finally {
      setIsSubmitting(false);
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
        <h3 className='text-zinc-100 font-medium mb-2'>
          Password Reset Successful
        </h3>
        <p className='text-sm text-zinc-400'>
          Your password has been securely updated. You can now log in with your
          new credentials.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 w-full'>
      <Input
        label='New Password'
        name='newPassword'
        type='password'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder='••••••••'
        required
      />

      {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

      <Button type='submit' className='w-full mt-6' isLoading={isSubmitting}>
        Set New Password
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
