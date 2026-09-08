import useUiStore from "../../store/uiStore";

const SpaceCard = ({ space }) => {
  const { activeSpaceId, setActiveSpaceId } = useUiStore();
  const isActive = activeSpaceId === space._id;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all cursor-pointer group ${isActive ? "border-zinc-500 bg-[#1A1A1A]" : "border-[#2A2A2A] bg-[#151515] hover:border-[#333333]"}`}
      onClick={() => setActiveSpaceId(space._id)}
    >
      <div className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${isActive ? "bg-zinc-200 text-zinc-900" : "bg-[#222222] text-zinc-300 group-hover:bg-[#2A2A2A] transition-colors"}`}
          >
            {space.name.charAt(0).toUpperCase()}
          </div>
          <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-medium text-zinc-400'>
            <svg
              className='w-3.5 h-3.5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
              ></path>
            </svg>
            {space.members?.length || 0}
          </div>
        </div>
        <h3
          className={`text-lg font-medium mb-1.5 ${isActive ? "text-white" : "text-zinc-200"}`}
        >
          {space.name}
        </h3>
        <p className='text-sm text-zinc-500 line-clamp-2 min-h-10'>
          {space.description || "No description provided."}
        </p>
      </div>

      <div
        className={`h-1 w-full transition-all ${isActive ? "bg-zinc-500" : "bg-transparent"}`}
      ></div>
    </div>
  );
};

export default SpaceCard;
