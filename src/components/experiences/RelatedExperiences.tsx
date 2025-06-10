
import ExperienceCard from './ExperienceCard';
import { Experience } from '@/data/experiencesData';

interface RelatedExperiencesProps {
  experiences: Experience[];
}

const RelatedExperiences = ({ experiences }: RelatedExperiencesProps) => {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-haven-beige bg-opacity-20">
      <div className="container-custom">
        <h2 className="text-3xl font-serif font-bold text-center mb-8">
          Similar Experiences
        </h2>
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
