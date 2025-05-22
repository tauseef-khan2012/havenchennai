
interface LocationHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const LocationHero = ({ title, subtitle, backgroundImage }: LocationHeroProps) => {
  return (
    <section className="relative h-[60vh] bg-black overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: 'brightness(0.6)'
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="relative h-full container-custom flex flex-col justify-center">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-white">{subtitle}</p>
        </div>
      </div>
    </section>
  );
};

export default LocationHero;
