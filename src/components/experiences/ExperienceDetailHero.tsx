
import { Badge } from '@/components/ui/badge';
import { Experience } from '@/data/experiencesData';

interface ExperienceDetailHeroProps {
  experience: Experience;
}

const ExperienceDetailHero = ({ experience }: ExperienceDetailHeroProps) => {
  return (
    <section className="relative h-[60vh] bg-black overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${experience.imageUrl})`,
          filter: 'brightness(0.6)'
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="relative h-full container-custom flex flex-col justify-center">
        <div className="max-w-2xl animate-fade-up">
          <Badge className="mb-4 bg-haven-green text-white px-3 py-1 text-sm">{experience.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{experience.title}</h1>
          <p className="text-xl text-white">{experience.description}</p>
        </div>
      </div>
    </section>
  );
};

export default ExperienceDetailHero;
