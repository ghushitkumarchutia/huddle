import ChangePasswordForm from "../components/profile/ChangePasswordForm";
import AccountSettings from "../components/profile/AccountSettings";

const AccountSettingsPage = () => {
  return (
    <div className='max-w-3xl mx-auto w-full pt-8 px-4 sm:px-6 lg:px-8 pb-24'>
      <div className='mb-8'>
        <h1 className='text-2xl font-semibold text-zinc-100 mb-1'>
          Account Settings
        </h1>
        <p className='text-sm text-zinc-400'>
          Manage your security and preferences.
        </p>
      </div>

      <div className='bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 shadow-sm mb-6'>
        <h2 className='text-lg font-medium text-zinc-100 mb-6'>
          Change Password
        </h2>
        <ChangePasswordForm />
      </div>

      <AccountSettings />
    </div>
  );
};

export default AccountSettingsPage;
