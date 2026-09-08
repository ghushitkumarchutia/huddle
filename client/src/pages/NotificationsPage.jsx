import NotificationList from "../components/notifications/NotificationList";

const NotificationsPage = () => {
  return (
    <div className='max-w-2xl mx-auto w-full pt-8 px-4 sm:px-6 lg:px-8 pb-24'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-zinc-100 mb-1'>
            Notifications
          </h1>
          <p className='text-sm text-zinc-400'>
            Stay updated with your activity.
          </p>
        </div>
      </div>

      <NotificationList />
    </div>
  );
};

export default NotificationsPage;
