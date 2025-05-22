
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StayHero from '@/components/stay/StayHero';
import StayNavigation from '@/components/stay/StayNavigation';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

const StayDeckViews = () => {
  const deckViews = [
    {
      name: 'Rooftop Deck',
      description: 'Our spectacular rooftop deck offers 360-degree views of the lake and sky, perfect for stargazing and sunrise watching.',
      image: '/lovable-uploads/15b485a2-1d79-4783-ba80-f0cf6d9d7a20.png',
      features: [
        'Panoramic views of Muttukadu Lake',
        'Comfortable seating for relaxation',
        'Perfect spot for watching sunrises and sunsets',
        'Nighttime stargazing opportunities'
      ]
    },
    {
      name: 'Ground Floor Deck',
      description: 'The ground floor deck provides a comfortable outdoor living space with direct views of the surrounding nature.',
      image: '/lovable-uploads/15811ea8-1b7c-41c0-9b75-05f249f60154.png',
      features: [
        'Shaded relaxation area',
        'Perfect for morning coffee',
        'Watch local birds and wildlife',
        'Connect with nature'
      ]
    },
    {
      name: 'First Floor Smoking Deck',
      description: 'A designated space for smokers with beautiful views and comfortable seating.',
      image: '/lovable-uploads/a768b355-2a53-4898-91c5-3372bc1fe662.png',
      features: [
        'Designated smoking area',
        'Elevated views',
        'Fresh air circulation',
        'Private space'
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <main>
        <StayHero 
          title="Deck Views"
          subtitle="Experience breathtaking panoramas from our thoughtfully designed deck spaces."
          backgroundImage="/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png"
        />
        <StayNavigation />
        
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-serif text-3xl font-bold mb-4">Spectacular Views from Every Deck</h2>
              <p className="text-gray-700">
                Our container home features multiple deck spaces, each offering unique perspectives of the surrounding natural beauty. 
                From the ground floor to the rooftop, immerse yourself in the serene environment while enjoying modern comforts.
              </p>
            </div>
            
            <div className="space-y-20">
              {deckViews.map((deck, index) => (
                <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
                  <div className="md:w-1/2">
                    <img 
                      src={deck.image} 
                      alt={deck.name} 
                      className="w-full h-[300px] object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="font-serif text-2xl font-semibold mb-3">{deck.name}</h3>
                    <p className="text-gray-700 mb-4">{deck.description}</p>
                    <h4 className="font-medium mb-2">Highlights:</h4>
                    <ul className="space-y-1">
                      {deck.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-20">
              <h3 className="font-serif text-2xl font-semibold mb-6 text-center">Photo Gallery</h3>
              <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent>
                  <CarouselItem>
                    <img 
                      src="/lovable-uploads/15b485a2-1d79-4783-ba80-f0cf6d9d7a20.png" 
                      alt="Rooftop Deck View" 
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img 
                      src="/lovable-uploads/15811ea8-1b7c-41c0-9b75-05f249f60154.png" 
                      alt="Ground Floor Deck" 
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img 
                      src="/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png" 
                      alt="Lake View from Deck" 
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img 
                      src="/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png" 
                      alt="Sunset View" 
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default StayDeckViews;
