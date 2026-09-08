import { useEffect, useRef } from "react";
import { useFeed } from "../../hooks/useFeed";
import PostCard from "../posts/PostCard";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";

const FeedList = ({ groupId }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useFeed(groupId);

  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" },
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "pending") {
    return (
      <div className='flex justify-center py-12'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className='text-center text-red-500 py-12 text-sm'>
        Failed to load feed. {error?.message}
      </div>
    );
  }

  const posts = data.pages.flatMap((page) => page.data.posts);

  if (posts.length === 0) {
    return (
      <EmptyState
        message={
          groupId
            ? "No posts in this group yet."
            : "Your feed is empty. Follow some spaces to see posts here."
        }
      />
    );
  }

  return (
    <div className='max-w-2xl mx-auto w-full pb-24'>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      <div ref={loadMoreRef} className='py-6 flex justify-center h-20'>
        {isFetchingNextPage && <Spinner size='md' />}
        {!hasNextPage && posts.length > 0 && (
          <span className='text-xs text-zinc-600 font-medium tracking-wide uppercase'>
            You're all caught up
          </span>
        )}
      </div>
    </div>
  );
};

export default FeedList;
