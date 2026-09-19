import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Calendar, 
  FileText, 
  CreditCard, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const PatientSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/patient-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patient/doctors', icon: Search, label: 'Find Doctors' },
    { path: '/patient/my-appointments', icon: Calendar, label: 'My Appointments' },
    { path: '/view-medical-report', icon: FileText, label: 'Medical Records' },
    { path: '/patient/make-payment', icon: CreditCard, label: 'Payments' },
    { path: '/patient/update-profile', icon: User, label: 'My Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    // This will be handled by the parent component
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-slate-200/80 bg-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 shadow-sm shadow-teal-900/20">
              <span className="text-lg font-extrabold text-white">M</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">MediCare</h1>
              <p className="text-xs font-medium text-slate-400">Patient portal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto p-4">
          <p className="px-3 pb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">My care</p>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                    className={`
                      flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200
                      ${isActive 
                        ? 'bg-teal-50 text-teal-800 font-bold shadow-sm shadow-teal-900/5' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-slate-100 bg-white p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-rose-600 transition-colors hover:bg-rose-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default PatientSidebar;
