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
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsUserLoading(false);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsUserLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Active section detection
  const getCurrentSection = () => {
    if (location.pathname === '/ResultRecord1') return '/ResultRecord1';
    if (location.hash && navItems.some(i => i.id === location.hash)) return location.hash;
    return '#home';
  };

  useEffect(() => {
    setActiveSection(getCurrentSection());

    if (location.pathname !== '/') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    navItems.forEach((item) => {
      if (item.id.startsWith('#')) {
        const el = document.querySelector(item.id);
        if (el) observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [location.pathname, location.hash]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setActiveSection(sectionId);

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
        const el = document.querySelector(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
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
    try {
      await supabase.auth.signOut();
      setUser(null);
      setTimeout(() => {
        setShowLogoutModal(false);
        setShowUserMenu(false);
        navigate('/#home');
      }, 1800);
    } catch (err) {
      console.error('Logout failed:', err);
      setShowLogoutModal(false);
    }
  };

  const getUserInitials = () => user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <>
      {isLoadingResult && <Loading3 />}
      {isLoadingLogin && <Loading />}

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 bg-white shadow-lg z-50 transition-all duration-300 ${
          location.pathname === '/login' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="text-2xl font-bold">
              <span className="text-black">Know</span>
              <span className="text-blue-500">You</span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden xl:flex items-center space-x-10">
              {navItems.map((item) => (
                (location.pathname !== '/ResultRecord1' || item.id === '/ResultRecord1') && (
                  <a
                    key={item.id}
                    href={item.id}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`text-lg font-medium transition-all duration-300 ${
                      activeSection === item.id
                        ? 'text-blue-600 font-bold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </a>
                )
              ))}

              {/* User / Login */}
              {isUserLoading ? (
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
                  >
                    {getUserInitials()}
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-12 right-0 bg-white shadow-xl rounded-lg py-3 w-56 border">
                      <p className="px-4 py-2 text-sm text-gray-600 border-b truncate">{user.email}</p>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Hamburger - FAR RIGHT */}
            <div className="xl:hidden ml-auto">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 p-2"
              >
                {isOpen ? (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div ref={menuRef} className="xl:hidden absolute top-16 left-0 right-0 bg-white shadow-2xl border-t">
              <div className="px-6 py-4 space-y-1">
                {navItems.map((item) => (
                  (location.pathname !== '/ResultRecord1' || item.id === '/ResultRecord1') && (
                    <a
                      key={item.id}
                      href={item.id}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className={`block py-3 text-lg font-medium rounded-lg px-4 transition ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </a>
                  )
                ))}
              </div>

              <div className="border-t px-6 py-4">
                {user ? (
                  <>
                    <p className="text-sm text-gray-600 mb-3 truncate">{user.email}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Logout Modal - Clean & Beautiful */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-10 text-center shadow-2xl max-w-sm w-full">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Logging Out</h3>
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 0116 0 8 8 0 01-16 0" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">Signing you out securely...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;