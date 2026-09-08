import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "../../api/group.api";
import useUiStore from "../../store/uiStore";
import Input from "../common/Input";
import Button from "../common/Button";

const CreateGroupForm = ({ onSuccess }) => {
  const { activeSpaceId, addToast } = useUiStore();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => createGroup(activeSpaceId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", activeSpaceId] });
      addToast({ type: "success", message: "Group created successfully." });
      setName("");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to create group.",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeSpaceId) {
      addToast({ type: "error", message: "You must select a space first." });
      return;
    }
    mutate();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        label='Group Name'
        name='name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='e.g. Design'
        required
      />

      <div className='flex justify-end mt-4'>
        <Button type='submit' isLoading={isPending} className='w-full'>
          Create Group
        </Button>
      </div>
    </form>
  );
};

export default CreateGroupForm;
