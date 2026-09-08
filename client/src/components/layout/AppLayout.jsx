import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Toast from "../common/Toast";

const AppLayout = () => {
  return (
    <div className='min-h-screen bg-[#121212] text-zinc-200 font-sans selection:bg-zinc-700 selection:text-white flex flex-col'>
      <Navbar />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <main className='flex-1 relative overflow-y-auto bg-[#121212]'>
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
};

export default AppLayout;
