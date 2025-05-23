
import React from 'react';
import { Button } from '@/components/ui/button';

interface SlideContentProps {
  title: string;
  subtitle: string;
  cta?: {
    text: string;
    href: string;
  };
}

export const HeroSlideContent: React.FC<SlideContentProps> = ({
  title,
  subtitle,
  cta
}) => {
  return (
    <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay">
          {subtitle}
        </p>
        {cta && (
          <Button
            asChild
            size="lg"
            className="bg-haven-green hover:bg-haven-green/90 text-white font-semibold px-8 py-3 text-lg animate-fade-in-delay-2"
          >
            <a href={cta.href}>
              {cta.text}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};
