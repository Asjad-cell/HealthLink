import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";

interface NavbarProps {
  onMenuClick: () => void; // callback to toggle sidebar
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Navigate immediately to prevent any flash of login page
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <span className="text-xl font-bold text-gray-800">HealthLink</span>

        {/* User info and logout */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5 cursor-pointer" />
            <span className="ml-2 text-sm">Logout</span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
