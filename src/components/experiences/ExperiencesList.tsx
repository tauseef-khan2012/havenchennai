
import { Button } from '@/components/ui/button';
import { Experience } from '@/data/experiencesData';
import ExperienceCard from './ExperienceCard';

interface ExperiencesListProps {
  experiences: Experience[];
  clearFilters: () => void;
}

const ExperiencesList = ({ experiences, clearFilters }: ExperiencesListProps) => {
  return (
    <section className="py-16">
      <div className="container-custom">
        {experiences.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No experiences found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map(experience => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperiencesList;
