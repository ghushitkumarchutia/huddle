import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinSpace } from "../../api/space.api";
import useUiStore from "../../store/uiStore";
import Input from "../common/Input";
import Button from "../common/Button";

const JoinSpaceForm = ({ onSuccess }) => {
  const { addToast } = useUiStore();
  const queryClient = useQueryClient();

  const [inviteCode, setInviteCode] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => joinSpace({ inviteCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      addToast({ type: "success", message: "Joined space successfully." });
      setInviteCode("");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      addToast({
        type: "error",
        message:
          error.response?.data?.message || "Invalid or expired invite code.",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        label='Invite Code'
        name='inviteCode'
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        placeholder='Enter your invite code'
        required
      />

      <div className='flex justify-end mt-4'>
        <Button type='submit' isLoading={isPending} className='w-full'>
          Join Space
        </Button>
      </div>
    </form>
  );
};

export default JoinSpaceForm;
