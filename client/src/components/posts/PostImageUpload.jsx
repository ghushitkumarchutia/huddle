import { useRef, useState } from "react";

const PostImageUpload = ({ onImageSelected, onImageRemoved }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
      setPreview(URL.createObjectURL(file));
      onImageSelected(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onImageRemoved();
  };

  return (
    <div className='mt-4'>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/jpeg,image/png,image/gif'
        className='hidden'
      />

      {preview ? (
        <div className='relative inline-block mt-2'>
          <img
            src={preview}
            alt='Preview'
            className='h-32 rounded-lg object-cover border border-[#2A2A2A]'
          />
          <button
            type='button'
            onClick={handleRemove}
            className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              ></path>
            </svg>
          </button>
        </div>
      ) : (
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className='text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2 text-sm font-medium'
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            ></path>
          </svg>
          Attach Image
        </button>
      )}
    </div>
  );
};

export default PostImageUpload;
