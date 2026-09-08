import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/user.api";
import useUiStore from "../../store/uiStore";
import Input from "../common/Input";
import Button from "../common/Button";

const EditProfileForm = ({ initialData }) => {
  const { addToast } = useUiStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    displayName: initialData?.displayName || "",
    bio: initialData?.bio || "",
    avatarUrl: initialData?.avatarUrl || "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      addToast({ type: "success", message: "Profile updated successfully." });
    },
    onError: (error) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to update profile.",
      });
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        label='Display Name'
        name='displayName'
        value={formData.displayName}
        onChange={handleChange}
        placeholder='Jane Doe'
      />
      <Input
        label='Username'
        name='username'
        value={formData.username}
        onChange={handleChange}
        placeholder='janedoe'
      />
      <div>
        <label className='block text-xs font-medium text-zinc-400 mb-1.5'>
          Bio
        </label>
        <textarea
          name='bio'
          value={formData.bio}
          onChange={handleChange}
          placeholder='Tell us a little about yourself'
          className='w-full bg-[#1A1A1A] text-zinc-200 border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 placeholder-zinc-600 transition-colors resize-none h-24'
        />
      </div>
      <Input
        label='Avatar URL'
        name='avatarUrl'
        value={formData.avatarUrl}
        onChange={handleChange}
        placeholder='https://example.com/avatar.jpg'
      />

      <div className='flex justify-end mt-4'>
        <Button type='submit' isLoading={isPending}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
