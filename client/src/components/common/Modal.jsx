import { useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-[#151515] border border-[#2A2A2A] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]'>
          <h3 className='text-base font-medium text-zinc-100'>{title}</h3>
          <button
            onClick={onClose}
            className='text-zinc-500 hover:text-zinc-300 transition-colors'
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
                d='M6 18L18 6M6 6l12 12'
              ></path>
            </svg>
          </button>
        </div>
        <div className='p-6'>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
