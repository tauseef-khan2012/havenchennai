import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuthSession();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container-custom mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="font-serif text-2xl font-bold text-haven-dark">
          Haven
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/stay"
            className={cn(
              "text-sm font-medium transition-colors hover:text-haven-teal",
              isActive("/stay") ? "text-haven-teal" : "text-gray-700"
            )}
          >
            The Stay
          </Link>
          <Link
            to="/experiences"
            className={cn(
              "text-sm font-medium transition-colors hover:text-haven-teal",
              isActive("/experiences") ? "text-haven-teal" : "text-gray-700"
            )}
          >
            Experiences
          </Link>
          <Link
            to="/location"
            className={cn(
              "text-sm font-medium transition-colors hover:text-haven-teal",
              isActive("/location") ? "text-haven-teal" : "text-gray-700"
            )}
          >
            Location
          </Link>
          <Link
            to="/gallery"
            className={cn(
              "text-sm font-medium transition-colors hover:text-haven-teal",
              isActive("/gallery") ? "text-haven-teal" : "text-gray-700"
            )}
          >
            Gallery
          </Link>
          <Link
            to="/about"
            className={cn(
              "text-sm font-medium transition-colors hover:text-haven-teal",
              isActive("/about") ? "text-haven-teal" : "text-gray-700"
            )}
          >
            About Us
          </Link>
          
          {user ? (
            <Link to="/dashboard">
              <Button variant="outline" className="border-haven-teal text-haven-teal">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="border-haven-teal text-haven-teal">
                Login
              </Button>
            </Link>
          )}
          
          <Link to="/booking">
            <Button className="bg-haven-teal hover:bg-haven-teal/90">
              Book Now
            </Button>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/stay"
              className={cn(
                "text-sm font-medium transition-colors hover:text-haven-teal p-2",
                isActive("/stay") ? "text-haven-teal" : "text-gray-700"
              )}
            >
              The Stay
            </Link>
            <Link
              to="/experiences"
              className={cn(
                "text-sm font-medium transition-colors hover:text-haven-teal p-2",
                isActive("/experiences") ? "text-haven-teal" : "text-gray-700"
              )}
            >
              Experiences
            </Link>
            <Link
              to="/location"
              className={cn(
                "text-sm font-medium transition-colors hover:text-haven-teal p-2",
                isActive("/location") ? "text-haven-teal" : "text-gray-700"
              )}
            >
              Location
            </Link>
            <Link
              to="/gallery"
              className={cn(
                "text-sm font-medium transition-colors hover:text-haven-teal p-2",
                isActive("/gallery") ? "text-haven-teal" : "text-gray-700"
              )}
            >
              Gallery
            </Link>
            <Link
              to="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-haven-teal p-2",
                isActive("/about") ? "text-haven-teal" : "text-gray-700"
              )}
            >
              About Us
            </Link>
            
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
              {user ? (
                <Link to="/dashboard" className="w-full">
                  <Button variant="outline" className="w-full border-haven-teal text-haven-teal">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full border-haven-teal text-haven-teal">
                    Login
                  </Button>
                </Link>
              )}
              
              <Link to="/booking" className="w-full">
                <Button className="w-full bg-haven-teal hover:bg-haven-teal/90">
                  Book Now
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
