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

  useEffect(() => {
    if (location.pathname !== '/login') {
      setIsVisible(true);
    }
  }, [location.pathname]);

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      setIsUserLoading(true);
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error.message);
          setUser(null);
        } else {
          console.log('User fetched:', user);
          setUser(user);
        }
      } catch (error) {
        console.error('Unexpected error fetching user:', error);
        setUser(null);
      } finally {
        setIsUserLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setUser(session?.user ?? null);
      setIsUserLoading(false);
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (sectionId === '/ResultRecord1') {
      setIsLoadingResult(true);
      setTimeout(() => {
        navigate(sectionId);
        setActiveSection(sectionId);
        setIsLoadingResult(false);
        setIsOpen(false);
      }, 2500);
    } else {
      if (sectionId.startsWith('#')) {
        if (location.pathname !== '/') {
          navigate(`/${sectionId}`);
        } else {
          const section = document.querySelector(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }
        setActiveSection(sectionId);
      } else {
        navigate(sectionId);
        setActiveSection(sectionId);
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
    setShowLogoutCheckmark(false);
    const startTime = Date.now();

    try {
      console.log('Initiating logout...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error.message);
        throw error;
      }

      localStorage.removeItem('token');
      console.log('Local storage token removed');

      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      console.log('Logout successful');
      setUser(null);

      const elapsed = Date.now() - startTime;
      setShowLogoutCheckmark(true);
      setTimeout(() => {
        setShowLogoutModal(false);
        setShowUserMenu(false);
        setIsOpen(false);
        if (location.pathname === '/ResultRecord1') {
          window.location.reload();
        } else {
          navigate('/#home');
        }
      }, Math.max(0, 2000 - elapsed));
    } catch (error) {
      console.error('Logout error:', error);
      setShowLogoutModal(false);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const getUserInitials = () => {
    if (!user || !user.email) return 'U';
    const name = user.email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const matchingNavItem = navItems.find(
      (item) => item.id === location.pathname || item.id === `#${location.hash}` || item.id === location.hash
    );
    setActiveSection(matchingNavItem ? matchingNavItem.id : '#home');

    if (location.pathname !== '/') return;

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    navItems.forEach((item) => {
      if (item.id.startsWith('#')) {
        const section = document.querySelector(item.id);
        if (section) observer.observe(section);
      }
    });

    return () => {
      navItems.forEach((item) => {
        if (item.id.startsWith('#')) {
          const section = document.querySelector(item.id);
          if (section) observer.unobserve(section);
        }
      });
    };
  }, [location.pathname, location.hash]);

  const isResultPage = location.pathname === '/ResultRecord1';

  return (
    <>
      {isLoadingResult && <Loading3 />}
      {isLoadingLogin && <Loading />}
      <header
        ref={headerRef}
        className={`fixed w-full bg-white shadow-md z-50 ${
          isLoadingResult || isLoadingLogin || location.pathname === '/login' ? 'opacity-0' : 'opacity-100 transition-opacity duration-50 ease-in'
        }`}
        style={{ opacity: isVisible && !isLoadingLogin && location.pathname !== '/login' ? 1 : 0 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <a
                href="#home"
                onClick={(e) => handleNavClick(e, '#home')}
                className="text-2xl font-bold text-gray-800"
              >
                <span className="text-black">Know</span>
                <span className="text-blue-400">You</span>
              </a>
            </div>

            <div className="hidden xl:flex items-center space-x-8">
              {navItems.map((item) => (
                (!isResultPage || item.id === '/ResultRecord1') && (
                  <a
                    key={item.id}
                    href={item.id}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`text-gray-600 hover:text-gray-900 transition-colors cursor-pointer relative ${
                      activeSection === item.id ? 'text-gray-900' : ''
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900" />
                    )}
                  </a>
                )
              ))}
              {isUserLoading ? (
                <div className="w-10 h-10"></div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-400 text-white font-semibold hover:bg-blue-500 transition-colors"
                    title={user.email}
                  >
                    {getUserInitials()}
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-12 right-0 bg-white shadow-md rounded-md py-2 w-48 max-w-[90vw] z-50 overflow-hidden">
                      <div className="px-4 py-2 text-gray-600 border-b truncate">{user.email}</div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="border border-blue-400 text-blue-400 bg-white px-4 py-2 rounded-md hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            <div className="xl:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {isOpen && (
            <div
              ref={menuRef}
              className="xl:hidden bg-white shadow-md absolute top-16 right-4 w-48 max-w-[90vw] rounded-md py-2 overflow-hidden"
            >
              {navItems.map((item) => (
                (!isResultPage || item.id === '/ResultRecord1') && (
                  <a
                    key={item.id}
                    href={item.id}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`block px-4 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer relative ${
                      activeSection === item.id ? 'text-gray-900' : ''
                    }`}
                  >
                    {item.label}
                  </a>
                )
              ))}
              {isUserLoading ? (
                <div className="px-4 py-2"></div>
              ) : user ? (
                <>
                  <div className="px-4 py-2 text-gray-600 border-b truncate">{user.email}</div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLoginClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-1.5 border border-blue-400 text-blue-400 bg-white hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </nav>
      </header>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all ease-out duration-300"
            style={{
              transform: showLogoutModal ? 'scale(1)' : 'scale(0.9)',
              opacity: showLogoutModal ? 1 : 0,
            }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-center text-black mb-4">
              Logging Out
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              {showLogoutCheckmark ? 'Logout successful!' : 'Logging you out...'}
            </p>
            <div className="flex justify-center">
              {showLogoutCheckmark ? (
                <svg
                  className="w-10 sm:w-12 h-10 sm:h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  className="w-10 sm:w-12 h-10 sm:h-12 text-blue-400 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 0116 0 8 8 0 01-16 0" />
                </svg>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;