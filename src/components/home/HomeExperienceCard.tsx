
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { HomeExperience } from '@/data/homeExperiencesData';

interface HomeExperienceCardProps {
  experience: HomeExperience;
}

const HomeExperienceCard = ({ experience }: HomeExperienceCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="min-w-[280px] sm:min-w-[320px] md:min-w-[300px] lg:min-w-[280px] snap-start">
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="h-48 overflow-hidden">
            <img 
              src={experience.image} 
              alt={experience.alt}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              loading="lazy"
              data-lowres={experience.image.replace('.png', '-lowres.png')}
            />
          </div>
          <div className="p-5">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-haven-teal bg-haven-teal/10 rounded-full mb-3">
              {experience.category}
            </span>
            <h3 className="font-serif text-xl font-semibold mb-2">{experience.title}</h3>
            <p className="text-gray-600 mb-4">{experience.hook}</p>
            <Button 
              variant="outline" 
              className="text-haven-teal border-haven-teal hover:bg-haven-teal hover:text-white"
              onClick={() => setIsOpen(true)}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{experience.title}</DialogTitle>
            <DialogDescription className="text-haven-teal">
              {experience.category} • {experience.travelTime}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md overflow-hidden">
              <img 
                src={experience.image} 
                alt={experience.alt}
                className="w-full h-64 object-cover"
              />
            </div>
            <p className="text-gray-700">{experience.story}</p>
            <Link to={`/experiences/${experience.id}`}>
              <Button className="bg-haven-teal text-white hover:bg-opacity-90 w-full">
                View Experience Details
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomeExperienceCard;
