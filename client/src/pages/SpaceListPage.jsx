import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getSpaces } from "../../api/space.api";
import SpaceCard from "../components/spaces/SpaceCard";
import CreateSpaceForm from "../components/spaces/CreateSpaceForm";
import JoinSpaceForm from "../components/spaces/JoinSpaceForm";
import Spinner from "../components/common/Spinner";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import { useState } from "react";

const SpaceListPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["spaces"],
    queryFn: getSpaces,
  });

  return (
    <div className='max-w-5xl mx-auto w-full pt-8 px-4 sm:px-6 lg:px-8 pb-24'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-2xl font-semibold text-zinc-100 mb-1'>
            Your Spaces
          </h1>
          <p className='text-sm text-zinc-400'>
            Workspaces you are a member of.
          </p>
        </div>
        <div className='flex gap-3'>
          <Button variant='secondary' onClick={() => setIsJoinModalOpen(true)}>
            Join Space
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create Space
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-20'>
          <Spinner size='lg' />
        </div>
      ) : error ? (
        <div className='text-center text-red-500 py-20'>
          Failed to load spaces.
        </div>
      ) : data?.data?.length === 0 ? (
        <div className='text-center py-20 bg-[#151515] border border-[#2A2A2A] rounded-2xl'>
          <p className='text-zinc-400 mb-4'>You are not in any spaces yet.</p>
          <div className='flex justify-center gap-4'>
            <Button
              variant='secondary'
              onClick={() => setIsJoinModalOpen(true)}
            >
              Join Space
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Space
            </Button>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {data.data.map((space) => (
            <Link key={space._id} to={`/spaces/${space._id}`}>
              <SpaceCard space={space} />
            </Link>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title='Create New Space'
      >
        <CreateSpaceForm onSuccess={() => setIsCreateModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title='Join Space'
      >
        <JoinSpaceForm onSuccess={() => setIsJoinModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default SpaceListPage;
