import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "../../api/comment.api";
import Avatar from "../common/Avatar";
import Pagination from "../common/Pagination";
import Spinner from "../common/Spinner";
import { formatDate } from "../../utils/formatDate";

const CommentList = ({ postId }) => {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ["comments", postId, page],
    queryFn: () => getComments({ postId, pageParam: page, limit }),
  });

  if (isLoading) {
    return (
      <div className='flex justify-center py-6'>
        <Spinner size='md' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-500 text-sm py-4'>
        Failed to load comments.
      </div>
    );
  }

  const comments = data?.data?.comments || [];
  const hasMore = data?.data?.hasMore || false;

  if (comments.length === 0) {
    return (
      <div className='text-center py-8 text-sm text-zinc-500 italic'>
        No comments yet. Be the first to share your thoughts.
      </div>
    );
  }

  return (
    <div className='mt-8 space-y-6'>
      <h3 className='text-sm font-semibold text-zinc-200 mb-4'>Comments</h3>

      {comments.map((comment) => (
        <div key={comment._id} className='flex gap-4'>
          <Avatar
            src={comment.authorSnapshot?.avatarUrl}
            alt={comment.authorSnapshot?.displayName}
            size='sm'
            className='mt-1'
          />
          <div className='flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl rounded-tl-sm p-4'>
            <div className='flex justify-between items-start mb-2'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium text-zinc-200'>
                  {comment.authorSnapshot?.displayName}
                </span>
                <span className='text-xs text-zinc-500'>
                  @{comment.authorSnapshot?.username}
                </span>
              </div>
              <span className='text-xs text-zinc-500'>
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className='text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap'>
              {comment.content}
            </p>
          </div>
        </div>
      ))}

      {(page > 1 || hasMore) && (
        <Pagination
          page={page}
          hasMore={hasMore}
          onNext={() => setPage((p) => p + 1)}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
        />
      )}
    </div>
  );
};

export default CommentList;
