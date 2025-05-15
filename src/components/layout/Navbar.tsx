
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="bg-white bg-opacity-95 sticky top-0 z-50 shadow-sm">
      <div className="container-custom flex justify-between items-center py-4">
        <Link to="/" className="flex items-center">
          <span className="font-serif text-haven-green text-2xl font-bold">Haven</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-haven-dark hover:text-haven-green transition-colors">Home</Link>
          <Link to="/about" className="text-haven-dark hover:text-haven-green transition-colors">About Us</Link>
          <Link to="/stay" className="text-haven-dark hover:text-haven-green transition-colors">Stay</Link>
          <Link to="/experiences" className="text-haven-dark hover:text-haven-green transition-colors">Experiences</Link>
          <Link to="/packages" className="text-haven-dark hover:text-haven-green transition-colors">Packages</Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-haven-green text-white">
                    {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || user.email?.[0].toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-haven-dark hover:text-haven-green transition-colors">My Account</span>
              </Link>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="ml-4">Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md animate-fade-in">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link to="/" className="text-haven-dark hover:text-haven-green transition-colors py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/about" className="text-haven-dark hover:text-haven-green transition-colors py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/stay" className="text-haven-dark hover:text-haven-green transition-colors py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Stay</Link>
            <Link to="/experiences" className="text-haven-dark hover:text-haven-green transition-colors py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Experiences</Link>
            <Link to="/packages" className="text-haven-dark hover:text-haven-green transition-colors py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Packages</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-haven-dark hover:text-haven-green transition-colors py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
                  My Account
                </Link>
                <Button variant="outline" className="w-full" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
