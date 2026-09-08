import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { listGroups } from "../../api/group.api";
import useUiStore from "../../store/uiStore";

const GroupList = () => {
  const { activeSpaceId, setActiveGroupId } = useUiStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["groups", activeSpaceId],
    queryFn: () => listGroups(activeSpaceId),
    enabled: !!activeSpaceId,
  });

  if (!activeSpaceId) {
    return (
      <div className='px-3 py-2 text-xs text-zinc-500 italic'>
        Select a space to view groups
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='px-3 py-2 text-xs text-zinc-500'>Loading groups...</div>
    );
  }

  if (error) {
    return (
      <div className='px-3 py-2 text-xs text-red-500'>
        Failed to load groups.
      </div>
    );
  }

  const groups = data?.data || [];

  if (groups.length === 0) {
    return (
      <div className='px-3 py-2 text-xs text-zinc-500 italic'>
        No groups found.
      </div>
    );
  }

  return (
    <div className='space-y-0.5 mt-2'>
      {groups.map((group) => (
        <NavLink
          key={group._id}
          to={`/groups/${group._id}`}
          onClick={() => setActiveGroupId(group._id)}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-[#222222] text-zinc-100" : "text-zinc-400 hover:text-zinc-200 hover:bg-[#1A1A1A]"}`
          }
        >
          <span className='text-zinc-500'>#</span>
          {group.name}
        </NavLink>
      ))}
    </div>
  );
};

export default GroupList;
