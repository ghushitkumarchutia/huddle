const registerEngagementHandlers = (io, socket) => {
  socket.on("joinPost", (postId) => {
    socket.join(`post:${postId}`);
  });

  socket.on("leavePost", (postId) => {
    socket.leave(`post:${postId}`);
  });
};

const emitLikeCountUpdate = (io, postId, newCount) => {
  io.to(`post:${postId}`).emit("likeCountUpdate", { postId, newCount });
};

const emitCommentCountUpdate = (io, postId, newCount) => {
  io.to(`post:${postId}`).emit("commentCountUpdate", { postId, newCount });
};

export {
  registerEngagementHandlers,
  emitLikeCountUpdate,
  emitCommentCountUpdate,
};
