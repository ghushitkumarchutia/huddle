const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create a Space",
      description:
        "Set up a dedicated environment for your project, team, or community in seconds.",
    },
    {
      number: "02",
      title: "Organize with Groups",
      description:
        "Break down your space into focused groups like 'Design', 'Engineering', or 'General'.",
    },
    {
      number: "03",
      title: "Engage Deeply",
      description:
        "Share posts, comment on threads, and follow colleagues in a quiet, organized feed.",
    },
  ];

  return (
    <section className='py-24 px-6 bg-[#151515] border-y border-[#2A2A2A]'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-semibold text-zinc-100 mb-4'>
            How Huddle Works
          </h2>
          <p className='text-zinc-400 max-w-xl mx-auto'>
            A simpler, calmer way to collaborate.
          </p>
        </div>
        <div className='grid md:grid-cols-3 gap-8'>
          {steps.map((step, index) => (
            <div
              key={index}
              className='bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 relative overflow-hidden group hover:border-[#333333] transition-colors'
            >
              <div className='text-5xl font-bold text-zinc-800/50 absolute top-4 right-4 pointer-events-none'>
                {step.number}
              </div>
              <h3 className='text-lg font-medium text-zinc-200 mb-3 relative z-10'>
                {step.title}
              </h3>
              <p className='text-sm text-zinc-400 leading-relaxed relative z-10'>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
