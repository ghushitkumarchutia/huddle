import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useUiStore from "../../store/uiStore";
import FeedList from "../components/feed/FeedList";
import GroupList from "../components/groups/GroupList";
import CreateGroupForm from "../components/groups/CreateGroupForm";
import Modal from "../components/common/Modal";
import { useState } from "react";

const SpaceDetailPage = () => {
  const { spaceId } = useParams();
  const { setActiveSpaceId, activeGroupId } = useUiStore();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  useEffect(() => {
    if (spaceId) {
      setActiveSpaceId(spaceId);
    }
  }, [spaceId, setActiveSpaceId]);

  return (
    <div className='flex h-full'>
      {/* Internal space sidebar just for groups, could be integrated into global sidebar, but structurally isolated here for simplicity */}
      <div className='w-64 border-r border-[#2A2A2A] bg-[#121212] p-4 hidden md:block overflow-y-auto'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-sm font-semibold text-zinc-100'>Groups</h2>
          <button
            onClick={() => setIsGroupModalOpen(true)}
            className='w-6 h-6 rounded bg-[#2A2A2A] flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors'
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
                d='M12 4v16m8-8H4'
              ></path>
            </svg>
          </button>
        </div>
        <GroupList />
      </div>

      <div className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
        <div className='max-w-2xl mx-auto w-full'>
          {activeGroupId ? (
            <FeedList groupId={activeGroupId} />
          ) : (
            <div className='text-center py-20 text-zinc-500'>
              Select a group from the sidebar to view posts.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        title='Create Group'
      >
        <CreateGroupForm onSuccess={() => setIsGroupModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default SpaceDetailPage;
