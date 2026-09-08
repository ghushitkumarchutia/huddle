import { useParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import PostCard from "../components/posts/PostCard";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";

const PostDetailPage = () => {
  const { postId } = useParams();
  const queryClient = useQueryClient();

  // Since backend doesn't currently expose a single-post GET endpoint,
  // we retrieve the post from the feed cache.
  // In a production app, we'd add the endpoint and useQuery here.
  let post = null;

  // Search through all feed query caches
  const feedQueries = queryClient.getQueriesData({ queryKey: ["feed"] });
  for (const [queryKey, data] of feedQueries) {
    if (data?.pages) {
      for (const page of data.pages) {
        const found = page.data.posts.find((p) => p._id === postId);
        if (found) {
          post = found;
          break;
        }
      }
    }
    if (post) break;
  }

  if (!post) {
    return (
      <div className='max-w-2xl mx-auto w-full pt-16 px-4 text-center'>
        <h2 className='text-xl font-medium text-zinc-100 mb-2'>
          Post Not Found
        </h2>
        <p className='text-sm text-zinc-500 mb-6'>
          The post you are looking for does not exist or you don't have access.
        </p>
        <Link
          to='/feed'
          className='text-blue-400 hover:text-blue-300 text-sm font-medium'
        >
          Return to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto w-full pt-8 px-4 sm:px-6 lg:px-8 pb-24'>
      <div className='mb-6'>
        <Link
          to='/feed'
          className='text-zinc-500 hover:text-zinc-300 text-sm font-medium flex items-center gap-2 transition-colors'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 19l-7-7m0 0l7-7m-7 7h18'
            ></path>
          </svg>
          Back
        </Link>
      </div>

      <PostCard post={post} />

      <div className='bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 shadow-sm mt-4'>
        <CommentForm postId={postId} />
        <CommentList postId={postId} />
      </div>
    </div>
  );
};

export default PostDetailPage;
