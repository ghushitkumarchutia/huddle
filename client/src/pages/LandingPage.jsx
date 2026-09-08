import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import ProductPreview from "../components/landing/ProductPreview";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className='min-h-screen bg-[#121212] flex flex-col font-sans selection:bg-zinc-700 selection:text-white'>
      <main className='flex-1'>
        <Hero />
        <HowItWorks />
        <ProductPreview />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
