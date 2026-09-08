import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useUiStore from "../store/uiStore";
import { searchPosts } from "../api/search.api";
import SearchBar from "../components/search/SearchBar";
import PostCard from "../components/posts/PostCard";
import Spinner from "../components/common/Spinner";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";

  const { activeSpaceId } = useUiStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", "posts", activeSpaceId, query],
    queryFn: () => searchPosts(activeSpaceId, null, query),
    enabled: !!query && !!activeSpaceId,
  });

  return (
    <div className='max-w-2xl mx-auto w-full pt-8 px-4 sm:px-6 lg:px-8 pb-24'>
      <div className='mb-8'>
        <h1 className='text-2xl font-semibold text-zinc-100 mb-4'>Search</h1>
        <SearchBar />
      </div>

      {query && !activeSpaceId && (
        <div className='text-center py-12 text-sm text-zinc-500'>
          Please select a space to search within.
        </div>
      )}

      {query && activeSpaceId && isLoading && (
        <div className='flex justify-center py-12'>
          <Spinner size='md' />
        </div>
      )}

      {query && activeSpaceId && error && (
        <div className='text-center text-red-500 py-12 text-sm'>
          Search failed.
        </div>
      )}

      {query && activeSpaceId && data && (
        <div>
          <h2 className='text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider'>
            Results for "{query}"
          </h2>

          {data.data?.length === 0 ? (
            <div className='text-center py-12 text-sm text-zinc-500 italic'>
              No posts found matching your query.
            </div>
          ) : (
            <div className='space-y-4'>
              {data.data.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
