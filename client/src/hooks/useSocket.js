import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const useSocket = (postId) => {
  const [likeCount, setLikeCount] = useState(null);
  const [commentCount, setCommentCount] = useState(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!postId || !accessToken) return;

    const socket = io(SOCKET_URL, {
      auth: {
        token: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    socket.on("connect", () => {
      socket.emit("joinPost", postId);
    });

    socket.on("likeCountUpdate", (data) => {
      if (data.postId === postId) {
        setLikeCount(data.newCount);
      }
    });

    socket.on("commentCountUpdate", (data) => {
      if (data.postId === postId) {
        setCommentCount(data.newCount);
      }
    });

    return () => {
      socket.emit("leavePost", postId);
      socket.disconnect();
    };
  }, [postId, accessToken]);

  return { likeCount, commentCount };
};

export default useSocket;
