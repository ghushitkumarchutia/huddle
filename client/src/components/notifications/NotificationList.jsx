import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getNotifications, markAsRead } from "../../api/notification.api";
import Avatar from "../common/Avatar";
import Spinner from "../common/Spinner";
import { formatDate } from "../../utils/formatDate";

const NotificationList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications({ limit: 50 }),
  });

  const { mutate: readNotification } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (isLoading) {
    return (
      <div className='flex justify-center py-12'>
        <Spinner size='md' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-500 py-12 text-sm'>
        Failed to load notifications.
      </div>
    );
  }

  const notifications = data?.data?.notifications || [];

  if (notifications.length === 0) {
    return (
      <div className='text-center py-12 text-sm text-zinc-500 italic'>
        You have no notifications.
      </div>
    );
  }

  const getNotificationMessage = (type) => {
    switch (type) {
      case "like":
        return "liked your post.";
      case "comment":
        return "commented on your post.";
      case "follow":
        return "started following you.";
      default:
        return "interacted with you.";
    }
  };

  return (
    <div className='space-y-2'>
      {notifications.map((notif) => (
        <div
          key={notif._id}
          onClick={() => {
            if (!notif.isRead) readNotification(notif._id);
          }}
          className={`flex items-start gap-4 p-4 rounded-xl transition-colors cursor-pointer border ${notif.isRead ? "bg-[#151515] border-transparent hover:border-[#2A2A2A]" : "bg-[#1A1A1A] border-[#333333]"}`}
        >
          <Avatar
            src={notif.actor?.avatarUrl}
            alt={notif.actor?.displayName}
            size='md'
          />
          <div className='flex-1'>
            <div className='flex justify-between items-start'>
              <p className='text-sm text-zinc-200'>
                <span className='font-semibold text-white'>
                  {notif.actor?.displayName || "Someone"}
                </span>{" "}
                {getNotificationMessage(notif.type)}
              </p>
              <span className='text-xs text-zinc-500 whitespace-nowrap ml-4'>
                {formatDate(notif.createdAt)}
              </span>
            </div>
            {notif.post && (
              <Link
                to={`/posts/${notif.post}`}
                className='inline-block mt-2 text-xs text-blue-400 hover:text-blue-300 font-medium'
                onClick={(e) => e.stopPropagation()}
              >
                View Post
              </Link>
            )}
          </div>
          {!notif.isRead && (
            <div className='w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0'></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
