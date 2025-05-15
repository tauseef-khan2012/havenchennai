
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-black overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
              filter: 'brightness(0.6)'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="relative h-full container-custom flex flex-col justify-center">
            <div className="max-w-2xl animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Story</h1>
              <p className="text-xl text-white">Learn about Haven's vision and the team behind our unique experiences.</p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold mb-6">The Haven Journey</h2>
                <p className="text-gray-700 mb-4">
                  Haven was born from a shared passion for nature and a vision to create a new kind of hospitality experience. Our founders, avid outdoor enthusiasts and design lovers, discovered this pristine piece of land and immediately recognized its potential.
                </p>
                <p className="text-gray-700 mb-4">
                  The idea was simple yet revolutionary: transform shipping containers into luxurious, eco-friendly accommodations that would allow guests to immerse themselves in nature without sacrificing comfort.
                </p>
                <p className="text-gray-700">
                  After months of careful design and sustainable construction, Haven welcomed its first guests in 2022. Since then, we've been dedicated to creating unforgettable experiences that reconnect people with nature, support local communities, and promote environmental stewardship.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Founders of Haven" 
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 bg-haven-beige bg-opacity-30">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-haven-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Environmental Stewardship</h3>
                <p className="text-gray-600">
                  We're committed to minimizing our environmental footprint, using renewable energy, implementing water conservation measures, and supporting local reforestation efforts.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-haven-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Community Connection</h3>
                <p className="text-gray-600">
                  We collaborate with local experts, source ingredients from nearby farms, and contribute to community initiatives that preserve the cultural heritage of our region.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-haven-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Authentic Experiences</h3>
                <p className="text-gray-600">
                  We believe in the power of genuine connections with nature and local culture, creating experiences that inspire, educate, and refresh our guests.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Meet the Team */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Emma Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-1">Emma Johnson</h3>
                <p className="text-haven-green mb-3">Founder & Experience Director</p>
                <p className="text-gray-600 px-4">With a background in outdoor education and sustainable tourism, Emma designs our unique nature experiences.</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="David Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-1">David Chen</h3>
                <p className="text-haven-green mb-3">Co-Founder & Design Lead</p>
                <p className="text-gray-600 px-4">An architect specializing in sustainable design, David transformed shipping containers into our beautiful accommodations.</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Maya Rodriguez" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-1">Maya Rodriguez</h3>
                <p className="text-haven-green mb-3">Hospitality Manager</p>
                <p className="text-gray-600 px-4">With years of experience in luxury hospitality, Maya ensures every guest receives exceptional service during their stay.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-haven-green text-white">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Join Us on this Journey</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Experience the magic of Haven for yourself. Book your stay and discover why our guests keep coming back.
            </p>
            <Link to="/stay">
              <Button variant="secondary" size="lg">Book Your Stay</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;
