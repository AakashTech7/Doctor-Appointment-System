import React, { useState, useContext } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Menu 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../Context/LoginContext';

const PatientHeader = ({ onMenuClick }) => {
  const { user, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="rounded-xl p-2 text-slate-600 transition hover:bg-teal-50 hover:text-teal-700 lg:hidden"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="flex lg:hidden items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700 shadow-sm">
              <span className="text-sm font-extrabold text-white">M</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">MediCare</span>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors, appointments..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View notifications"
              className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-white bg-rose-500"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                <h3 className="font-semibold text-gray-800 mb-3">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-800">Appointment confirmed for tomorrow</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-800">Payment successful</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
            >
              <div className="grid h-9 w-9 place-items-center rounded-full bg-teal-100">
                <User className="h-4 w-4 text-teal-700" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-800">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500">Patient</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/patient/update-profile');
                  }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full text-left"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/settings');
                  }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full text-left"
                >
                  <span className="text-gray-700">Settings</span>
                </button>
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600"
                >
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PatientHeader;
