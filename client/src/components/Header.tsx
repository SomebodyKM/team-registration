import { useNavigate } from 'react-router';
import { LuTrophy, LuLogOut } from 'react-icons/lu';
import { useAuthStore } from '../stores/auth.store';

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-[#0A1628] shadow-lg sticky top-0 z-10">
      <div className="max-w-285 mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-linear-to-br from-[#0EA5E9] to-[#0284C7] rounded-lg flex items-center justify-center shadow-md shrink-0">
            <LuTrophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-white hidden sm:block font-bold">Tournament Portal</span>
        </div>

        {/* Right: Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center rounded-md text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] gap-2 h-9 px-3 transition-colors"
          aria-label="Logout"
        >
          <LuLogOut className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
