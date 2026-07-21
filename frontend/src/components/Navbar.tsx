import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Cpu, LogOut, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LogoutModal } from './LogoutModal';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  const isNotHome = location.pathname !== '/';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-xl transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Custom Logo Integration */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                {!logoError ? (
                  <img
                    src="/logo.png"
                    alt="Platform Logo"
                    onError={() => setLogoError(true)}
                    className="w-9 h-9 object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="font-extrabold text-lg sm:text-xl text-zinc-950 tracking-tight">AI Flow</span>
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Home / Dashboard Navigation Button when on Task Details Page */}
                {isNotHome && (
                  <Link
                    to="/"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/90 transition-all text-xs font-extrabold shadow-xs shrink-0"
                    title="Return to Home Dashboard"
                  >
                    <Home className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Home</span>
                  </Link>
                )}

                {/* Logged in User Badge (Sleek Proportioned Pill) */}
                <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-zinc-100/90 border border-zinc-200 text-zinc-900 text-xs font-extrabold shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[11px] font-black shrink-0 shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-extrabold text-zinc-900 truncate max-w-[80px] sm:max-w-[160px]">
                    {user?.name}
                  </span>
                </div>

                {/* Logout Trigger Button */}
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-rose-50 text-zinc-700 hover:text-rose-600 border border-zinc-200 hover:border-rose-200 transition-all text-xs font-bold shrink-0"
                  title="Logout account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white framer-button-primary rounded-2xl shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={logout}
      />
    </>
  );
};
