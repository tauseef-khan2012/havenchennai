
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  isActive: boolean;
  className?: string;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, className, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors hover:text-haven-teal",
        isActive ? "text-haven-teal" : "text-gray-700",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
