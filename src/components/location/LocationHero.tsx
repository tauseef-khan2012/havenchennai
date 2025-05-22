
import PageHero from '../shared/PageHero';

interface LocationHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const LocationHero = ({ title, subtitle, backgroundImage }: LocationHeroProps) => {
  return (
    <PageHero 
      title={title}
      subtitle={subtitle}
      backgroundImage={backgroundImage}
    />
  );
};

export default LocationHero;
