import { useParams } from "react-router-dom";
import FeedList from "../components/feed/FeedList";
import CreatePostForm from "../components/posts/CreatePostForm";
import EngagementDigest from "../components/digest/EngagementDigest";

const FeedPage = () => {
  const { groupId } = useParams();

  return (
    <div className='max-w-6xl mx-auto w-full pt-8 px-4 sm:px-6 lg:px-8 flex gap-8'>
      <div className='flex-1 max-w-2xl'>
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-zinc-100 mb-1'>
            {groupId ? "Group Feed" : "Home Feed"}
          </h1>
          <p className='text-sm text-zinc-400'>
            See the latest updates and discussions.
          </p>
        </div>

        <CreatePostForm />
        <FeedList groupId={groupId} />
      </div>

      <div className='w-80 hidden lg:block space-y-6 shrink-0'>
        <EngagementDigest />
      </div>
    </div>
  );
};

export default FeedPage;
