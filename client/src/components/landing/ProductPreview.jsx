const ProductPreview = () => {
  return (
    <section className='py-16 px-6 max-w-6xl mx-auto'>
      <div className='rounded-2xl border border-[#2A2A2A] bg-[#151515] shadow-2xl overflow-hidden'>
        <div className='h-10 border-b border-[#2A2A2A] bg-[#1A1A1A] flex items-center px-4 gap-2'>
          <div className='w-3 h-3 rounded-full bg-red-500/80'></div>
          <div className='w-3 h-3 rounded-full bg-yellow-500/80'></div>
          <div className='w-3 h-3 rounded-full bg-emerald-500/80'></div>
        </div>

        <div className='flex h-125'>
          <div className='w-64 border-r border-[#2A2A2A] p-4 hidden md:block'>
            <div className='w-24 h-4 rounded bg-[#2A2A2A] mb-8'></div>
            <div className='space-y-3'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='flex items-center gap-3 px-2 py-1.5 rounded bg-[#1A1A1A] border border-[#222222]'
                >
                  <div className='w-4 h-4 rounded bg-[#333333]'></div>
                  <div className='w-20 h-3 rounded bg-[#2A2A2A]'></div>
                </div>
              ))}
            </div>
          </div>

          <div className='flex-1 p-8 bg-[#121212]'>
            <div className='max-w-2xl mx-auto space-y-6'>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className='p-6 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A]'
                >
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='w-10 h-10 rounded-full bg-[#2A2A2A]'></div>
                    <div>
                      <div className='w-24 h-3 rounded bg-[#333333] mb-2'></div>
                      <div className='w-16 h-2 rounded bg-[#2A2A2A]'></div>
                    </div>
                  </div>
                  <div className='space-y-2 mb-4'>
                    <div className='w-full h-3 rounded bg-[#222222]'></div>
                    <div className='w-5/6 h-3 rounded bg-[#222222]'></div>
                    <div className='w-4/6 h-3 rounded bg-[#222222]'></div>
                  </div>
                  <div className='flex gap-4'>
                    <div className='w-12 h-6 rounded bg-[#2A2A2A]'></div>
                    <div className='w-12 h-6 rounded bg-[#2A2A2A]'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPreview;
