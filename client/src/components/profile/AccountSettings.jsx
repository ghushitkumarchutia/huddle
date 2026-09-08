import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../../api/user.api";
import useUiStore from "../../store/uiStore";
import useAuthStore from "../../store/authStore";
import Modal from "../common/Modal";
import Button from "../common/Button";

const AccountSettings = () => {
  const { addToast } = useUiStore();
  const { clearAuth } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: performDelete, isPending } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      clearAuth();
      addToast({ type: "success", message: "Your account has been deleted." });
    },
    onError: (error) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to delete account.",
      });
      setIsModalOpen(false);
    },
  });

  return (
    <div>
      <div className='bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 mb-6'>
        <h3 className='text-lg font-medium text-zinc-100 mb-4'>
          Notification Preferences
        </h3>
        <div className='flex items-center justify-between py-3 border-b border-[#2A2A2A]'>
          <div>
            <p className='text-sm font-medium text-zinc-200'>Email Digest</p>
            <p className='text-xs text-zinc-500'>
              Receive a daily summary of activity.
            </p>
          </div>
          <div className='w-10 h-6 bg-[#2A2A2A] rounded-full relative cursor-pointer'>
            <div className='w-4 h-4 bg-zinc-400 rounded-full absolute top-1 left-1 transition-transform'></div>
          </div>
        </div>
        <div className='flex items-center justify-between py-3'>
          <div>
            <p className='text-sm font-medium text-zinc-200'>
              Push Notifications
            </p>
            <p className='text-xs text-zinc-500'>
              Get instant alerts for mentions and replies.
            </p>
          </div>
          <div className='w-10 h-6 bg-emerald-500/20 border border-emerald-500/50 rounded-full relative cursor-pointer'>
            <div className='w-4 h-4 bg-emerald-500 rounded-full absolute top-1 left-5 transition-transform'></div>
          </div>
        </div>
      </div>

      <div className='bg-red-500/5 border border-red-500/20 rounded-2xl p-6'>
        <h3 className='text-lg font-medium text-red-500 mb-2'>Danger Zone</h3>
        <p className='text-sm text-red-400/80 mb-4'>
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <Button variant='danger' onClick={() => setIsModalOpen(true)}>
          Delete Account
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Delete Account'
      >
        <div className='space-y-4'>
          <p className='text-sm text-zinc-300'>
            Are you absolutely sure? This action cannot be undone. This will
            permanently delete your account, posts, and remove your data from
            our servers.
          </p>
          <div className='flex justify-end gap-3 pt-4'>
            <Button
              variant='ghost'
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant='danger'
              onClick={() => performDelete()}
              isLoading={isPending}
            >
              Yes, delete my account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountSettings;
