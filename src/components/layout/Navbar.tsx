
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import useMobile from '@/hooks/use-mobile';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Stay', path: '/stay' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Location', path: '/location' },
    { name: 'Packages', path: '/packages' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center h-16 md:h-20">
        <Link to="/" className="font-serif text-2xl font-bold text-haven-dark">
          Haven
        </Link>

        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu} 
              className="p-2"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {menuOpen && (
              <div className="fixed inset-0 bg-white z-40 pt-16">
                <div className="container-custom py-4">
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`text-lg py-2 ${isActive(link.path) ? 'text-haven-green font-semibold' : 'text-gray-700'}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                    
                    {user ? (
                      <>
                        <Link 
                          to="/dashboard" 
                          className="text-lg py-2 text-gray-700"
                          onClick={() => setMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button 
                          onClick={() => {
                            signOut();
                            setMenuOpen(false);
                          }} 
                          className="text-lg py-2 text-gray-700 text-left"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link 
                        to="/login" 
                        className="text-lg py-2 text-gray-700"
                        onClick={() => setMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    )}
                  </nav>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center">
            <nav className="flex space-x-6 mr-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium ${
                    isActive(link.path)
                      ? 'text-haven-green'
                      : 'text-gray-700 hover:text-haven-green transition-colors'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
