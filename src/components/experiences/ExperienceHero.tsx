
import PageHero from '../shared/PageHero';

interface ExperienceHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const ExperienceHero = ({ title, subtitle, backgroundImage }: ExperienceHeroProps) => {
  return (
    <PageHero 
      title={title}
      subtitle={subtitle}
      backgroundImage={backgroundImage}
    />
  );
};

export default ExperienceHero;
