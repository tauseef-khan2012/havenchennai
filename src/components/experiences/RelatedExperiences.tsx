
import { Experience } from '@/data/experiencesData';
import ExperienceCard from './ExperienceCard';

interface RelatedExperiencesProps {
  experiences: Experience[];
}

const RelatedExperiences = ({ experiences }: RelatedExperiencesProps) => {
  if (experiences.length === 0) return null;
  
  return (
    <section className="py-16 bg-haven-beige bg-opacity-20">
      <div className="container-custom">
        <h2 className="font-serif text-3xl font-bold mb-8">Similar Experiences You Might Enjoy</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map(experience => (
            <ExperienceCard 
              key={experience.id} 
              experience={experience} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedExperiences;
