
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ExperiencePhilosophy = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-haven-moss/10 via-haven-beige-cool to-haven-teal/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
      <div className="absolute inset-0 leaf-pattern opacity-15"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-16 left-8 w-20 h-20 rounded-organic bg-haven-sunset/10 animate-float-gentle"></div>
      <div className="absolute bottom-20 right-12 w-16 h-16 rounded-organic-2 bg-haven-moss/20 animate-float-gentle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-organic-3 bg-haven-teal/15 animate-float-gentle" style={{ animationDelay: '2s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="glass-panel rounded-3xl p-10 md:p-16 shadow-organic-hover">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-1 bg-sunset-gradient rounded-full"></div>
              <span className="font-handwritten text-2xl text-haven-green">Our Philosophy</span>
              <div className="w-12 h-1 bg-sunset-gradient rounded-full"></div>
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-haven-dark">
              Our Experience <span className="text-haven-teal">Philosophy</span>
            </h2>
            
            <div className="space-y-8 text-lg text-haven-dark/80 leading-relaxed">
              <p>
                At Haven, we believe that <span className="font-semibold text-haven-green">meaningful experiences create lasting connections</span>. Our curated activities are designed to help you connect—with nature, with yourself, and with each other. From the serene waters of Muttukadu Lake to the starlit skies above our rooftop deck, each experience offers a unique way to embrace the beauty of simplicity and the richness of the present moment.
              </p>
              
              <div className="glass-panel rounded-2xl p-6 border-l-4 border-haven-teal bg-gradient-to-r from-haven-beige/50 to-transparent">
                <p className="italic">
                  "We've thoughtfully crafted each experience to complement the intimate nature of our container home, embracing sustainable practices and highlighting the natural wonders that surround us."
                </p>
              </div>
              
              <p>
                Whether you're watching birds take flight across the lake or enjoying a meal under the stars, we invite you to <span className="font-handwritten text-xl text-haven-sunset">slow down</span> and savor the simple luxury of time well spent.
              </p>
            </div>
            
            <div className="mt-10">
              <Link to="/stay">
                <Button className="bg-nature-gradient hover:shadow-organic-hover text-white font-semibold px-10 py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 ripple-effect">
                  Explore Our Container Stay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperiencePhilosophy;
