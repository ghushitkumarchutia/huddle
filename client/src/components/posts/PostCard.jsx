import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useSocket from "../../hooks/useSocket";
import { likePost, unlikePost } from "../../api/like.api";
import Avatar from "../common/Avatar";
import { formatDate } from "../../utils/formatDate";

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);

  const { likeCount: liveLikeCount, commentCount: liveCommentCount } =
    useSocket(post._id);

  const displayLikeCount =
    liveLikeCount !== null ? liveLikeCount : post.likeCount;
  const displayCommentCount =
    liveCommentCount !== null ? liveCommentCount : post.commentCount;

  const { mutate: toggleLike, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        await unlikePost(post._id);
      } else {
        await likePost(post._id);
      }
    },
    onMutate: () => {
      setIsLiked(!isLiked);
    },
    onError: () => {
      setIsLiked(isLiked);
    },
  });

  return (
    <div className='bg-[#151515] border border-[#2A2A2A] rounded-2xl p-5 mb-4 shadow-sm hover:border-[#333333] transition-colors'>
      <div className='flex items-center gap-3 mb-4'>
        <Avatar
          src={post.authorSnapshot?.avatarUrl}
          alt={post.authorSnapshot?.displayName}
          size='md'
        />
        <div>
          <div className='flex items-center gap-2'>
            <h4 className='text-sm font-medium text-zinc-100'>
              {post.authorSnapshot?.displayName}
            </h4>
            <span className='text-xs text-zinc-500'>
              @{post.authorSnapshot?.username}
            </span>
          </div>
          <div className='flex items-center gap-2 text-xs text-zinc-500 mt-0.5'>
            <span>{formatDate(post.createdAt)}</span>
            <span className='w-1 h-1 rounded-full bg-zinc-700'></span>
            <span>{post.space?.name}</span>
            <span className='w-1 h-1 rounded-full bg-zinc-700'></span>
            <span>{post.group?.name}</span>
          </div>
        </div>
      </div>

      <p className='text-zinc-200 text-sm leading-relaxed mb-4 whitespace-pre-wrap'>
        {post.content}
      </p>

      {post.imageUrl && (
        <div className='mb-4 rounded-xl overflow-hidden border border-[#2A2A2A]'>
          <img
            src={post.imageUrl}
            alt='Post content'
            className='w-full h-auto object-cover max-h-96'
          />
        </div>
      )}

      <div className='flex items-center gap-6 pt-3 border-t border-[#2A2A2A]'>
        <button
          onClick={() => toggleLike()}
          disabled={isLiking}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? "text-rose-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          <svg
            className={`w-5 h-5 ${isLiked ? "fill-current" : "fill-none"}`}
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
              d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
            ></path>
          </svg>
          {displayLikeCount}
        </button>

        <button className='flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            ></path>
          </svg>
          {displayCommentCount}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
