const Avatar = ({ src, alt, size = "md", className = "" }) => {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
    xl: "w-12 h-12 text-lg",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      className={`relative shrink-0 rounded-full overflow-hidden bg-[#2A2A2A] flex items-center justify-center text-zinc-300 font-medium ${sizes[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className='w-full h-full object-cover'
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <span className={src ? "hidden" : "flex"}>{getInitials(alt)}</span>
    </div>
  );
};

export default Avatar;
