
import { useRef } from 'react';

export const useStayNavigation = () => {
  // Refs for scroll sections
  const overviewRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);
  const deckViewsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    overviewRef,
    amenitiesRef,
    deckViewsRef,
    locationRef,
    scrollToSection
  };
};
