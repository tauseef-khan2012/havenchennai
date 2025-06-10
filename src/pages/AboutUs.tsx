
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/shared/PageHero';
import { MapPin, Heart, Leaf, Users } from 'lucide-react';

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

        {/* Property Details */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900">The Container Home</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Our unique accommodation features two vertically stacked shipping containers, thoughtfully converted 
                  into a comfortable retreat for up to 5 guests. The design maximizes both indoor comfort and outdoor 
                  connection with three distinct deck levels offering varied perspectives of Muttukadu Lake.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-haven-teal mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Prime Lakeside Location</h4>
                      <p className="text-gray-600">Situated in Padur along Chennai's OMR, offering easy accessibility while maintaining serene natural surroundings.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Leaf className="h-5 w-5 text-haven-teal mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Sustainable Architecture</h4>
                      <p className="text-gray-600">Innovative use of repurposed shipping containers showcases eco-friendly construction without compromising on comfort.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-haven-teal mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Thoughtful Design</h4>
                      <p className="text-gray-600">Every element is carefully curated to enhance guest experience, from premium mattresses to professional workspace setup.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <img 
                  src="/lovable-uploads/032b0326-be0f-4d2f-bc40-e4873823e984.png" 
                  alt="Haven container home workspace Chennai OMR"
                  className="w-full rounded-lg shadow-lg"
                />
                <img 
                  src="/lovable-uploads/80ae807c-39e1-4519-b19a-ed92c4b221cd.png" 
                  alt="Rooftop deck Muttukadu Lake view Haven Chennai"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 bg-white">
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
