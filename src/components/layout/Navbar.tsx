
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'The Container Home', path: '/stay' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white bg-opacity-80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
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
                        className={`text-lg py-2 ${isActive(link.path) ? 'text-haven-teal font-semibold' : 'text-gray-700'}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                    
                    <Link
                      to="/booking"
                      className="mt-4 inline-block"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Button className="bg-haven-teal text-white hover:bg-opacity-90 w-full">
                        Book Now
                      </Button>
                    </Link>
                    
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
                      ? 'text-haven-teal'
                      : 'text-gray-700 hover:text-haven-teal transition-colors'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link to="/booking">
                <Button className="bg-haven-teal text-white hover:bg-opacity-90">
                  Book Now
                </Button>
              </Link>
              
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
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
