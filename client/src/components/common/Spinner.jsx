const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4 border-[2px]",
    md: "w-6 h-6 border-[2px]",
    lg: "w-8 h-8 border-[3px]",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizes[size]} rounded-full border-zinc-700 border-t-zinc-300 animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
