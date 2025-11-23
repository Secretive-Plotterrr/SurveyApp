import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Loading3 from './Loading3';
import Loading from './Loading';

const supabase = createClient(
  'https://njodostonkvbovcgrayz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA'
);

const navItems = [
  { id: '#home', label: 'Home' },
  { id: '#about', label: 'About' },
  { id: '#survey', label: 'FAQ' },
  { id: '#feedback', label: 'Feedback' },
  { id: '/ResultRecord1', label: 'Result' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutCheckmark, setShowLogoutCheckmark] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Set visibility
  useEffect(() => {
    if (location.pathname !== '/login') {
      setIsVisible(true);
    }
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        headerRef.current &&
        menuRef.current &&
        !headerRef.current.contains(event.target) &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Auth handling
  useEffect(() => {
    const fetchUser = async () => {
      setIsUserLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsUserLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsUserLoading(false);
    });

    return () => authListener.subscription?.unsubscribe();
  }, []);

  // CRITICAL FIX: Correctly detect active section based on URL hash or path
  useEffect(() => {
    const currentHash = location.hash || '#home';
    const currentPath = location.pathname;

    if (currentPath === '/ResultRecord1') {
      setActiveSection('/ResultRecord1');
    } else if (navItems.some(item => item.id === currentHash)) {
      setActiveSection(currentHash);
    } else {
      setActiveSection('#home');
    }
  }, [location.pathname, location.hash]);

  // Smooth scroll for hash links
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();

    if (sectionId === '/ResultRecord1') {
      setIsLoadingResult(true);
      setTimeout(() => {
        navigate(sectionId);
        setIsLoadingResult(false);
        setIsOpen(false);
      }, 2000);
    } else {
      if (location.pathname !== '/') {
        navigate(`/${sectionId}`);
      } else {
        const section = document.querySelector(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setActiveSection(sectionId);
      setIsOpen(false);
    }
  };

  const handleLoginClick = () => {
    setIsLoadingLogin(true);
    setTimeout(() => {
      navigate('/login');
      setIsLoadingLogin(false);
      setIsOpen(false);
    }, 2500);
  };

  const handleLogout = async () => {
    setShowLogoutModal(true);
    setShowLogoutCheckmark(false);
    const startTime = Date.now();

    try {
      await supabase.auth.signOut();
      localStorage.removeItem('token');
      setUser(null);

      const elapsed = Date.now() - startTime;
      setShowLogoutCheckmark(true);
      setTimeout(() => {
        setShowLogoutModal(false);
        setShowUserMenu(false);
        setIsOpen(false);
        navigate('/#home');
      }, Math.max(0, 2000 - elapsed));
    } catch (error) {
      console.error('Logout error:', error);
      setShowLogoutModal(false);
    }
  };

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const isResultPage = location.pathname === '/ResultRecord1';

  return (
    <>
      {isLoadingResult && <Loading3 />}
      {isLoadingLogin && <Loading />}

      <header
        ref={headerRef}
        className={`fixed w-full bg-white shadow-md z-50 transition-opacity duration-500 ${
          location.pathname === '/login' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="text-2xl font-bold">
                <span className="text-black">Know</span>
                <span className="text-blue-400">You</span>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden xl:flex items-center space-x-8">
              {navItems.map((item) => (
                (!isResultPage || item.id === '/ResultRecord1') && (
                  <a
                    key={item.id}
                    href={item.id}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`relative text-gray-600 hover:text-gray-900 transition-colors pb-1 ${
                      activeSection === item.id ? 'text-gray-900 font-medium' : ''
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-all duration-300" />
                    )}
                  </a>
                )
              ))}

              {/* User / Login */}
              {isUserLoading ? (
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="w-10 h-10 rounded-full bg-blue-400 text-white font-bold hover:bg-blue-500 transition"
                  >
                    {getUserInitials()}
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-12 right-0 bg-white shadow-lg rounded-md py-2 w-48 border">
                      <div className="px-4 py-2 text-sm text-gray-600 border-b truncate">{user.email}</div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="border border-blue-400 text-blue-400 px-5 py-2 rounded-lg hover:bg-blue-50 transition"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden text-gray-700 hover:text-gray-900"
            >
              {isOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div ref={menuRef} className="xl:hidden absolute top-16 right-4 bg-white shadow-xl rounded-lg w-48 border overflow-hidden">
              {navItems.map((item) => (
                (!isResultPage || item.id === '/ResultRecord1') && (
                  <a
                    key={item.id}
                    href={item.id}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`block px-4 py-3 text-gray-700 hover:bg-blue-50 transition ${
                      activeSection === item.id ? 'bg-blue-50 text-blue-600 font-medium' : ''
                    }`}
                  >
                    {item.label}
                  </a>
                )
              ))}

              {isUserLoading ? null : user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600 border-t">{user.email}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="w-full text-left px-4 py-3 border-t text-blue-600 hover:bg-blue-50"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Logging Out</h3>
            {showLogoutCheckmark ? (
              <div className="text-green-500 text-6xl">Checkmark</div>
            ) : (
              <div className="text-blue-500 text-6xl animate-spin">Loading</div>
            )}
            <p className="mt-4 text-gray-600">
              {showLogoutCheckmark ? 'See you soon!' : 'Signing you out...'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;