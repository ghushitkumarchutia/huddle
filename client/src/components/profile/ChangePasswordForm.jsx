import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../api/user.api";
import useUiStore from "../../store/uiStore";
import Input from "../common/Input";
import Button from "../common/Button";

const ChangePasswordForm = () => {
  const { addToast } = useUiStore();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setFormData({ currentPassword: "", newPassword: "" });
      addToast({ type: "success", message: "Password changed successfully." });
    },
    onError: (error) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to change password.",
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
        label='Current Password'
        name='currentPassword'
        type='password'
        value={formData.currentPassword}
        onChange={handleChange}
        placeholder='••••••••'
        required
      />
      <Input
        label='New Password'
        name='newPassword'
        type='password'
        value={formData.newPassword}
        onChange={handleChange}
        placeholder='••••••••'
        required
      />

      <div className='flex justify-end mt-4'>
        <Button type='submit' isLoading={isPending}>
          Update Password
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
