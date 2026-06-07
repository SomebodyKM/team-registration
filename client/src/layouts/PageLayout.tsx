import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PageLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
