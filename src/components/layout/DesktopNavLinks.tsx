
import NavLink from "./NavLink";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DesktopNavLinksProps {
  isActive: (path: string) => boolean;
  user: any;
}

const DesktopNavLinks = ({ isActive, user }: DesktopNavLinksProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <NavLink to="/stay" isActive={isActive("/stay")}>
        The Stay
      </NavLink>
      <NavLink to="/experiences" isActive={isActive("/experiences")}>
        Experiences
      </NavLink>
      <NavLink to="/location" isActive={isActive("/location")}>
        Location
      </NavLink>
      <NavLink to="/gallery" isActive={isActive("/gallery")}>
        Gallery
      </NavLink>
      <NavLink to="/about" isActive={isActive("/about")}>
        About Us
      </NavLink>
      
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
  );
};

export default DesktopNavLinks;
