
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
  return (
    <button
      className="md:hidden flex items-center justify-center"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <X className="h-6 w-6 text-gray-700" />
      ) : (
        <Menu className="h-6 w-6 text-gray-700" />
      )}
    </button>
  );
};

export default MobileMenuButton;
