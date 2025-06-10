
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/shared/PageHero';
import { Heart, Leaf, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageHero 
        title="About Haven"
        subtitle="Sustainable Container Home Experience by Muttukadu Lake"
        backgroundImage="/lovable-uploads/0bf49c3a-e3e0-4828-badd-a492dc4dd957.png"
      />
      
      <main className="flex-1">
        {/* Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Haven was born from a vision to create unique, sustainable accommodation experiences that bring people closer to nature. 
                Located in Padur along Chennai's OMR beside the serene Muttukadu Lake, our container home represents a perfect blend of 
                eco-friendly architecture and lakeside tranquility.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="bg-haven-teal/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-haven-teal" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Sustainable Living</h3>
                <p className="text-gray-600">
                  Built using upcycled shipping containers, our accommodation showcases sustainable architecture 
                  while providing modern comfort and amenities.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-haven-teal/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-haven-teal" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Connection & Community</h3>
                <p className="text-gray-600">
                  Our space is designed to promote genuine connections - with nature, with loved ones, 
                  and with yourself through mindful living experiences.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-haven-teal/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-haven-teal" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Curated Experiences</h3>
                <p className="text-gray-600">
                  Beyond accommodation, we offer thoughtfully curated outdoor experiences including wellness activities, 
                  nature immersion, and cultural engagements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Haven represents the beginning of a larger vision to create a network of unique experience homes 
              that combine sustainable accommodation with curated outdoor activities. We believe in the power of 
              nature to restore, inspire, and connect us to what truly matters.
            </p>
            <p className="text-gray-600 leading-relaxed">
              As we grow, our commitment remains the same: to provide authentic, sustainable, and transformative 
              experiences that leave guests feeling refreshed, inspired, and more connected to themselves and the natural world.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
