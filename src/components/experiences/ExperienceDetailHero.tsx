
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';
import { Experience } from '@/data/experiencesData';

interface ExperienceDetailHeroProps {
  experience: Experience;
}

const ExperienceDetailHero = ({ experience }: ExperienceDetailHeroProps) => {
  return (
    <section className="relative h-[60vh] bg-black overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${experience.imageUrl})`,
          filter: 'brightness(0.6)'
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative h-full container-custom flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            <Badge className="bg-haven-green">{experience.category}</Badge>
            <div className="flex items-center text-white">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium ml-1">{experience.rating}</span>
              <span className="text-xs opacity-80 ml-1">({experience.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center text-white">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{experience.location}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">{experience.title}</h1>
          <p className="text-xl text-white opacity-90 max-w-2xl">{experience.description}</p>
        </div>
      </div>
    </section>
  );
};

export default ExperienceDetailHero;
