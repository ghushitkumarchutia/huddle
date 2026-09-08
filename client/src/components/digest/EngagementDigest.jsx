import { useQuery } from "@tanstack/react-query";
import { getDigest } from "../../api/digest.api";

const EngagementDigest = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["digest"],
    queryFn: getDigest,
  });

  if (isLoading) {
    return (
      <div className='bg-[#151515] border border-[#2A2A2A] rounded-2xl p-5 animate-pulse'>
        <div className='h-4 bg-[#2A2A2A] rounded w-1/3 mb-4'></div>
        <div className='h-10 bg-[#222222] rounded w-full mb-3'></div>
        <div className='h-10 bg-[#222222] rounded w-full'></div>
      </div>
    );
  }

  if (error || !data?.data) {
    return null;
  }

  const digest = data.data;

  if (digest.message) {
    return (
      <div className='bg-[#151515] border border-[#2A2A2A] rounded-2xl p-5'>
        <h3 className='text-sm font-semibold text-zinc-200 mb-2'>
          Weekly Summary
        </h3>
        <p className='text-xs text-zinc-500'>{digest.message}</p>
      </div>
    );
  }

  return (
    <div className='bg-linear-to-br from-[#1A1A1A] to-[#151515] border border-[#2A2A2A] rounded-2xl p-5 relative overflow-hidden'>
      <div className='absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl'></div>
      <h3 className='text-sm font-semibold text-zinc-100 mb-4 relative z-10'>
        Last 7 Days Impact
      </h3>

      <div className='space-y-4 relative z-10'>
        <div className='flex justify-between items-end border-b border-[#2A2A2A] pb-3'>
          <span className='text-xs font-medium text-zinc-400 uppercase tracking-wider'>
            Top Group
          </span>
          <span className='text-sm font-semibold text-blue-400'>
            #{digest.groupName}
          </span>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <span className='block text-2xl font-bold text-zinc-100 mb-1'>
              {digest.totalLikes}
            </span>
            <span className='block text-xs font-medium text-zinc-500'>
              Likes Received
            </span>
          </div>
          <div>
            <span className='block text-2xl font-bold text-zinc-100 mb-1'>
              {digest.totalComments}
            </span>
            <span className='block text-xs font-medium text-zinc-500'>
              Comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementDigest;
