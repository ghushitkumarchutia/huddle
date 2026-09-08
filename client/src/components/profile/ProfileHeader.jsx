import Avatar from "../common/Avatar";

const ProfileHeader = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className='bg-[#151515] border border-[#2A2A2A] rounded-2xl p-8 mb-6 relative overflow-hidden shadow-sm'>
      <div className='absolute top-0 left-0 w-full h-32 bg-linear-to-r from-[#222222] to-[#1A1A1A]'></div>
      <div className='relative pt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6'>
        <div className='p-2 bg-[#151515] rounded-full'>
          <Avatar
            src={profile.avatarUrl}
            alt={profile.displayName}
            size='xl'
            className='w-24 h-24 text-2xl'
          />
        </div>
        <div className='flex-1 text-center sm:text-left mb-2'>
          <h1 className='text-2xl font-semibold text-zinc-100'>
            {profile.displayName}
          </h1>
          <p className='text-zinc-500 text-sm mt-1'>@{profile.username}</p>
        </div>
      </div>
      <div className='mt-6'>
        {profile.bio ? (
          <p className='text-zinc-300 text-sm leading-relaxed max-w-2xl'>
            {profile.bio}
          </p>
        ) : (
          <p className='text-zinc-500 text-sm italic'>No bio provided yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
