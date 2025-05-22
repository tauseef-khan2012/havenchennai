
import PageHero from '../shared/PageHero';

interface StayHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const StayHero = ({ title, subtitle, backgroundImage }: StayHeroProps) => {
  return (
    <PageHero 
      title={title}
      subtitle={subtitle}
      backgroundImage={backgroundImage}
    />
  );
};

export default StayHero;
