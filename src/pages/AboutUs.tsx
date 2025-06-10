
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/shared/PageHero';
import { Heart, Leaf, Users, Quote } from 'lucide-react';

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
        {/* Founder's Story Section */}
        <section className="py-20 bg-navy-gradient relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
          <div className="absolute inset-0 leaf-pattern opacity-10"></div>
          
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
                <span className="font-handwritten text-2xl text-haven-yellow">Our Beginning</span>
                <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-haven-beige mb-8">
                A Journey Towards
                <span className="block text-haven-yellow">Mindful Living</span>
              </h2>
            </div>
            
            <div className="glass-panel-navy rounded-3xl p-10 mb-12 text-center">
              <Quote className="h-12 w-12 text-haven-yellow mx-auto mb-6" />
              <blockquote className="text-xl text-haven-beige/90 leading-relaxed italic mb-6">
                "After years in the corporate world, I realized that true fulfillment comes from creating spaces where people can reconnect with nature, themselves, and what truly matters. Haven isn't just accommodation—it's a reminder that sustainable living and modern comfort can coexist beautifully."
              </blockquote>
              <cite className="text-haven-yellow font-semibold">— Haven Founder</cite>
            </div>
            
            <div className="text-center">
              <p className="text-lg text-haven-beige/80 leading-relaxed max-w-3xl mx-auto">
                Born from a vision to escape the urban rush while staying connected to modern conveniences, 
                Haven represents our founder's journey from city life to creating meaningful experiences beside Muttukadu Lake. 
                What started as a personal retreat has evolved into a sanctuary for fellow seekers of balance.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold mb-6 text-gray-900">What We Stand For</h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Every element of Haven reflects our commitment to sustainable living, authentic experiences, 
                and the belief that the best moments happen when we slow down and connect.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="bg-haven-teal/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-haven-teal/20 transition-colors duration-300">
                  <Leaf className="h-10 w-10 text-haven-teal" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Sustainable Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  We prove that eco-conscious choices don't mean compromising comfort. Our repurposed shipping containers 
                  showcase how sustainable architecture can be both beautiful and functional, inspiring guests to reimagine 
                  their own relationship with the environment.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="bg-haven-teal/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-haven-teal/20 transition-colors duration-300">
                  <Heart className="h-10 w-10 text-haven-teal" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Authentic Connection</h3>
                <p className="text-gray-600 leading-relaxed">
                  In our hyper-connected world, we create spaces for genuine disconnection and reflection. 
                  Whether it's watching sunrise from our rooftop deck or sharing stories around evening tea, 
                  Haven fosters moments that matter.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="bg-haven-teal/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-haven-teal/20 transition-colors duration-300">
                  <Users className="h-10 w-10 text-haven-teal" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Mindful Hospitality</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every detail is intentionally curated—from locally sourced amenities to our carefully selected book collection. 
                  We believe that thoughtful touches create transformative experiences that guests carry with them long after they leave.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-6 text-gray-900">Our Vision</h2>
              <div className="w-24 h-1 bg-haven-teal mx-auto mb-8"></div>
            </div>
            
            <div className="bg-white rounded-2xl p-10 shadow-lg">
              <p className="text-xl text-gray-700 leading-relaxed mb-8 text-center">
                Haven is the first chapter in a larger story of creating conscious hospitality experiences across unique locations. 
                We envision a network of thoughtfully designed spaces that demonstrate how travel can be both transformative and responsible.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 text-center">
                <div className="p-6 bg-haven-teal/5 rounded-xl">
                  <h4 className="font-serif text-xl font-bold mb-3 text-gray-900">Expanding Mindfully</h4>
                  <p className="text-gray-600">
                    Each new location will honor local ecosystems and communities, creating employment and showcasing regional sustainability practices.
                  </p>
                </div>
                
                <div className="p-6 bg-haven-teal/5 rounded-xl">
                  <h4 className="font-serif text-xl font-bold mb-3 text-gray-900">Inspiring Change</h4>
                  <p className="text-gray-600">
                    We aim to inspire guests to integrate sustainable practices into their daily lives, creating ripple effects far beyond their stay.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600 leading-relaxed">
                  As we grow, our commitment remains unwavering: to provide authentic experiences that restore both people and planet, 
                  proving that conscious choices create the most meaningful journeys.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
