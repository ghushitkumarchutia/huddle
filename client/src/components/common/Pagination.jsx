import Button from "./Button";

const Pagination = ({ page, hasMore, onNext, onPrev }) => {
  return (
    <div className='flex items-center justify-between pt-4 border-t border-[#2A2A2A]'>
      <Button
        variant='secondary'
        onClick={onPrev}
        disabled={page <= 1}
        className='text-xs'
      >
        Previous
      </Button>
      <span className='text-xs font-medium text-zinc-500'>Page {page}</span>
      <Button
        variant='secondary'
        onClick={onNext}
        disabled={!hasMore}
        className='text-xs'
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
