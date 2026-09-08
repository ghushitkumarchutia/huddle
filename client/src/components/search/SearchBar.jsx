import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import { searchMembers } from "../../api/search.api";
import useUiStore from "../../store/uiStore";
import Avatar from "../common/Avatar";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const { activeSpaceId } = useUiStore();

  useEffect(() => {
    const fetchInline = async () => {
      if (debouncedQuery.length > 2 && activeSpaceId) {
        try {
          const res = await searchMembers(activeSpaceId, debouncedQuery);
          setResults(res.data?.slice(0, 5) || []);
        } catch (error) {
          console.error("Inline search failed", error);
        }
      } else {
        setResults([]);
      }
    };
    fetchInline();
  }, [debouncedQuery, activeSpaceId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className='relative w-full max-w-md'>
      <form onSubmit={handleSubmit} className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg
            className='w-4 h-4 text-zinc-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            ></path>
          </svg>
        </div>
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder='Search space...'
          className='w-full bg-[#1A1A1A] text-zinc-200 border border-[#2A2A2A] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder-zinc-500'
        />
      </form>

      {isFocused && results.length > 0 && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-xl overflow-hidden z-50'>
          <div className='p-2'>
            <div className='text-xs font-semibold text-zinc-500 px-3 py-1 uppercase tracking-wider'>
              Members
            </div>
            {results.map((user) => (
              <div
                key={user._id}
                className='flex items-center gap-3 px-3 py-2 hover:bg-[#222222] rounded-lg cursor-pointer transition-colors'
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                <Avatar src={user.avatarUrl} alt={user.displayName} size='sm' />
                <div>
                  <div className='text-sm font-medium text-zinc-200'>
                    {user.displayName}
                  </div>
                  <div className='text-xs text-zinc-500'>@{user.username}</div>
                </div>
              </div>
            ))}
          </div>
          <div
            className='px-4 py-3 border-t border-[#2A2A2A] text-xs font-medium text-blue-400 hover:bg-[#222222] cursor-pointer text-center'
            onClick={handleSubmit}
          >
            See all results for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
