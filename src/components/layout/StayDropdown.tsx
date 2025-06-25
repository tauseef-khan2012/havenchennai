
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StayDropdownProps {
  isActive: (path: string) => boolean;
}

const StayDropdown = ({ isActive }: StayDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const stayPages = [
    { to: "/stay/amenities", label: "Amenities" },
    { to: "/stay/deck-views", label: "Deck Views" },
    { to: "/stay/location", label: "Location" }
  ];
  
  const handleMouseEnter = () => {
    setIsOpen(true);
  };
  
  const handleMouseLeave = () => {
    setIsOpen(false);
  };
  
  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to="/stay/amenities"
        className={cn(
          "text-base font-semibold transition-colors hover:text-haven-teal flex items-center gap-1",
          isActive("/stay") ? "text-haven-teal" : "text-gray-700"
        )}
      >
        The Stay
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen ? "rotate-180" : ""
        )} />
      </Link>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {stayPages.map((page) => (
            <Link
              key={page.to}
              to={page.to}
              className={cn(
                "block px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                isActive(page.to) ? "text-haven-teal font-medium" : "text-gray-700"
              )}
            >
              {page.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StayDropdown;
