import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSpace } from "../../api/space.api";
import useUiStore from "../../store/uiStore";
import Input from "../common/Input";
import Button from "../common/Button";

const CreateSpaceForm = ({ onSuccess }) => {
  const { addToast } = useUiStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      addToast({ type: "success", message: "Space created successfully." });
      setFormData({ name: "", description: "" });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to create space.",
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
        label='Space Name'
        name='name'
        value={formData.name}
        onChange={handleChange}
        placeholder='e.g. Engineering Team'
        required
      />
      <div>
        <label className='block text-xs font-medium text-zinc-400 mb-1.5'>
          Description (Optional)
        </label>
        <textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          placeholder='What is this space for?'
          className='w-full bg-[#1A1A1A] text-zinc-200 border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 placeholder-zinc-600 transition-colors resize-none h-24'
        />
      </div>

      <div className='flex justify-end mt-4'>
        <Button type='submit' isLoading={isPending} className='w-full'>
          Create Space
        </Button>
      </div>
    </form>
  );
};

export default CreateSpaceForm;
