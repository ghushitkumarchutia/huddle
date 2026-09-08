import { useParams } from "react-router-dom";
import FeedList from "../components/feed/FeedList";
import CreatePostForm from "../components/posts/CreatePostForm";

const FeedPage = () => {
  const { groupId } = useParams();

  return (
    <div className='max-w-2xl mx-auto w-full pt-8 px-4 sm:px-6 lg:px-8'>
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
  );
};

export default FeedPage;
