import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUiStore from "../../store/uiStore";
import useAuthStore from "../../store/authStore";
import { createPost } from "../../api/post.api";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import PostImageUpload from "./PostImageUpload";

const CreatePostForm = () => {
  const { user } = useAuthStore();
  const { activeSpaceId, activeGroupId, addToast } = useUiStore();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const { mutate: submitPost, isPending } = useMutation({
    mutationFn: (formData) => createPost(formData),
    onSuccess: () => {
      setContent("");
      setImage(null);
      // Let the intersection observer/feed queries naturally refetch or we can invalidate
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      addToast({ type: "success", message: "Post published." });
    },
    onError: () => {
      addToast({ type: "error", message: "Failed to publish post." });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // As per backend: requires spaceId, groupId, content
    // We will supply defaults if not strictly inside a group context for now, or require them.
    if (!activeSpaceId || !activeGroupId) {
      addToast({
        type: "error",
        message: "Must select a space and group first.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("spaceId", activeSpaceId);
    formData.append("groupId", activeGroupId);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    submitPost(formData);
  };

  return (
    <div className='bg-[#151515] border border-[#2A2A2A] rounded-2xl p-5 mb-6 shadow-sm'>
      <form onSubmit={handleSubmit}>
        <div className='flex gap-4'>
          <Avatar src={user?.avatarUrl} alt={user?.displayName} size='md' />
          <div className='flex-1'>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className='w-full bg-transparent text-zinc-200 placeholder-zinc-600 resize-none outline-none text-sm min-h-15'
              maxLength={2000}
            />

            <PostImageUpload
              onImageSelected={setImage}
              onImageRemoved={() => setImage(null)}
            />
          </div>
        </div>

        <div className='flex justify-end mt-4 pt-4 border-t border-[#2A2A2A]'>
          <Button
            type='submit'
            disabled={
              !content.trim() || isPending || !activeSpaceId || !activeGroupId
            }
            isLoading={isPending}
            className='rounded-full px-6'
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
