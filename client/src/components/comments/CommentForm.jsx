import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "../../api/comment.api";
import useUiStore from "../../store/uiStore";
import useAuthStore from "../../store/authStore";
import Avatar from "../common/Avatar";
import Button from "../common/Button";

const CommentForm = ({ postId }) => {
  const { user } = useAuthStore();
  const { addToast } = useUiStore();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => addComment(postId, content),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      addToast({ type: "success", message: "Comment added." });
    },
    onError: () => {
      addToast({ type: "error", message: "Failed to add comment." });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex gap-4 mt-6 pt-6 border-t border-[#2A2A2A]'
    >
      <Avatar
        src={user?.avatarUrl}
        alt={user?.displayName}
        size='sm'
        className='mt-1'
      />
      <div className='flex-1 flex flex-col items-end gap-3'>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Write a comment...'
          className='w-full bg-[#1A1A1A] text-zinc-200 border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 placeholder-zinc-600 transition-colors resize-none h-20'
          maxLength={1000}
        />
        <Button
          type='submit'
          disabled={!content.trim() || isPending}
          isLoading={isPending}
          className='px-6 rounded-full'
        >
          Reply
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
