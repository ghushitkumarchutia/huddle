import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../store/authStore";
import { getProfile } from "../api/user.api";
import ProfileHeader from "../components/profile/ProfileHeader";
import EditProfileForm from "../components/profile/EditProfileForm";
import Spinner from "../components/common/Spinner";

const ProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuthStore();

  const targetId = !userId || userId === "me" ? "me" : userId;
  const isOwnProfile = targetId === "me" || targetId === user?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile", targetId],
    queryFn: () => getProfile(targetId),
  });

  if (isLoading) {
    return (
      <div className='flex justify-center py-20'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='text-center text-red-500 py-20'>
        Failed to load profile. {error?.message}
      </div>
    );
  }

  const profile = data.data;

  return (
    <div className='max-w-3xl mx-auto w-full pt-8 px-4 sm:px-6 lg:px-8 pb-24'>
      <ProfileHeader profile={profile} />

      {isOwnProfile && (
        <div className='bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 shadow-sm'>
          <h2 className='text-lg font-medium text-zinc-100 mb-6'>
            Edit Profile
          </h2>
          <EditProfileForm initialData={profile} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
