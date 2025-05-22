
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';

interface Experience {
  id: string;
  title: string;
  hook: string;
  category: string;
  image: string;
  alt: string;
  story: string;
  travelTime: string;
}

const experiences: Experience[] = [
  {
    id: '1',
    title: 'Mahabalipuram & Shore Temple',
    hook: 'Explore ancient UNESCO heritage sites',
    category: 'Cultural',
    image: '/lovable-uploads/8446db9f-ec1d-4876-adb8-84f568a58892.png',
    alt: 'Shore Temple at Mahabalipuram',
    story: 'Step back in time as you explore the magnificent 7th-century Shore Temple and the ancient rock-cut monuments of Mahabalipuram. This UNESCO World Heritage site showcases the remarkable Pallava dynasty architecture with its intricate carvings and historical significance. Don't miss the famous "Descent of the Ganges" rock relief, one of the largest open-air rock reliefs in the world.',
    travelTime: '30 minutes from Haven'
  },
  {
    id: '2',
    title: 'Muttukadu Boating',
    hook: 'Peaceful boat rides on the backwaters',
    category: 'Adventure',
    image: '/lovable-uploads/3d09a878-2b77-4c76-b9dc-916c5572305e.png',
    alt: 'Boating at Muttukadu backwaters',
    story: 'Experience the serene beauty of Muttukadu's expansive backwaters with a relaxing boat ride. Choose between motorboats, rowboats, or pedal boats as you glide across the calm waters surrounded by mangroves and wildlife. Perfect for photography enthusiasts and nature lovers, this activity provides a refreshing perspective of the coastal landscape.',
    travelTime: '5 minutes from Haven'
  },
  {
    id: '3',
    title: 'Sunrise Yoga & Meditation',
    hook: 'Greet the day with lakeside yoga',
    category: 'Wellness',
    image: '/lovable-uploads/d7acb4b7-3f86-425c-acc9-a34b740cb105.png',
    alt: 'Yoga session by Muttukadu Lake',
    story: 'Begin your day with a rejuvenating yoga and meditation session on our private deck overlooking Muttukadu Lake. Our experienced instructor guides you through gentle asanas and breathing techniques as the sun rises over the water. This peaceful practice allows you to connect with nature while finding your inner balance.',
    travelTime: 'On-site at Haven'
  },
  {
    id: '4',
    title: 'Crocodile Bank Visit',
    hook: 'Meet prehistoric reptiles up close',
    category: 'Adventure',
    image: '/lovable-uploads/3f68b7dc-fc1b-4cab-ac65-013e5c1e074f.png',
    alt: 'Crocodile at Madras Crocodile Bank',
    story: 'Discover one of the largest reptile zoos in the world at the Madras Crocodile Bank. Home to over 2,000 crocodiles, alligators, and other reptiles, this conservation center offers fascinating guided tours where you can learn about these prehistoric creatures. Don't miss the feeding sessions for an unforgettable experience!',
    travelTime: '15 minutes from Haven'
  },
  {
    id: '5',
    title: 'Beachside Dinner',
    hook: 'Romantic seafood feast by the ocean',
    category: 'Couples',
    image: '/lovable-uploads/43aa0007-941b-4b51-b1a0-a2b67f4bc6d2.png',
    alt: 'Beachside dinner setup near ECR',
    story: 'Indulge in a magical dining experience with your special someone right on the beach. We'll arrange a private table set against the backdrop of crashing waves and twinkling stars. Feast on freshly caught seafood prepared by local chefs while enjoying the gentle sea breeze and the sound of the ocean.',
    travelTime: '20 minutes from Haven'
  },
  {
    id: '6',
    title: 'Bird Watching Tour',
    hook: 'Spot migratory birds in their habitat',
    category: 'Adventure',
    image: '/lovable-uploads/ba10980e-eaed-41d2-950b-de5ba0f75e97.png',
    alt: 'Birds at Vedanthangal Bird Sanctuary',
    story: 'Join our expert naturalist for a guided bird watching tour around Muttukadu Lake and nearby wetlands. This area becomes a haven for numerous migratory and resident bird species. With binoculars provided, you'll observe painted storks, spot-billed pelicans, egrets, and many more in their natural habitat.',
    travelTime: '10-25 minutes from Haven'
  },
];

interface CardCarouselProps {
  experiences: Experience[];
  selectedCategory: string;
}

const CardCarousel = ({ experiences, selectedCategory }: CardCarouselProps) => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const filteredExperiences = selectedCategory === 'All' 
    ? experiences 
    : experiences.filter(exp => exp.category === selectedCategory);

  return (
    <>
      <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide">
        {filteredExperiences.map((experience) => (
          <div 
            key={experience.id}
            className="min-w-[280px] sm:min-w-[320px] md:min-w-[300px] lg:min-w-[280px] snap-start"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-48 overflow-hidden">
                <img 
                  src={experience.image} 
                  alt={experience.alt}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                  data-lowres={experience.image.replace('.png', '-lowres.png')}
                />
              </div>
              <div className="p-5">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-haven-teal bg-haven-teal/10 rounded-full mb-3">
                  {experience.category}
                </span>
                <h3 className="font-serif text-xl font-semibold mb-2">{experience.title}</h3>
                <p className="text-gray-600 mb-4">{experience.hook}</p>
                <Button 
                  variant="outline" 
                  className="text-haven-teal border-haven-teal hover:bg-haven-teal hover:text-white"
                  onClick={() => setSelectedExperience(experience)}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedExperience} onOpenChange={() => setSelectedExperience(null)}>
        {selectedExperience && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">{selectedExperience.title}</DialogTitle>
              <DialogDescription className="text-haven-teal">{selectedExperience.category} • {selectedExperience.travelTime}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-md overflow-hidden">
                <img 
                  src={selectedExperience.image} 
                  alt={selectedExperience.alt}
                  className="w-full h-64 object-cover"
                />
              </div>
              <p className="text-gray-700">{selectedExperience.story}</p>
              <Link to={`/experiences/${selectedExperience.id}`}>
                <Button className="bg-haven-teal text-white hover:bg-opacity-90 w-full">
                  View Experience Details
                </Button>
              </Link>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

const ExperiencesSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Wellness', 'Cultural', 'Adventure', 'Couples'];

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-haven-dark mb-2">
              Curated Experiences
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Discover the best of Chennai's East Coast Road with our handpicked experiences, from cultural landmarks to natural wonders.
            </p>
          </div>
          <Link to="/experiences" className="mt-4 md:mt-0 text-haven-teal hover:underline font-medium flex items-center">
            All Experiences <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`py-3 px-4 font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'text-haven-teal border-b-2 border-haven-teal'
                    : 'text-gray-600 hover:text-haven-teal'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <CardCarousel experiences={experiences} selectedCategory={activeCategory} />
      </div>
    </section>
  );
};

export default ExperiencesSection;
