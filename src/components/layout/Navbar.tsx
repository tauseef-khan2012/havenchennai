
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import DesktopNavLinks from "./DesktopNavLinks";
import MobileNavLinks from "./MobileNavLinks";
import MobileMenuButton from "./MobileMenuButton";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isLoading } = useAuth();
  
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
        
        <DesktopNavLinks isActive={isActive} user={user} />
        
        <MobileMenuButton 
          isOpen={isMenuOpen} 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
        />
      </div>
      
      <MobileNavLinks 
        isOpen={isMenuOpen} 
        isActive={isActive} 
        user={user} 
      />
    </header>
  );
};

export default Navbar;
