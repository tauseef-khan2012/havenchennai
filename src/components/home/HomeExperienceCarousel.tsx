
import { HomeExperience } from '@/data/homeExperiencesData';
import HomeExperienceCard from './HomeExperienceCard';

interface HomeExperienceCarouselProps {
  experiences: HomeExperience[];
  selectedCategory: string;
}

const HomeExperienceCarousel = ({ experiences, selectedCategory }: HomeExperienceCarouselProps) => {
  const filteredExperiences = selectedCategory === 'All' 
    ? experiences 
    : experiences.filter(exp => exp.category === selectedCategory);

  return (
    <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide">
      {filteredExperiences.map((experience) => (
        <HomeExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
};

export default HomeExperienceCarousel;
