
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeatureCard from '@/components/home/FeatureCard';
import PropertyHighlight from '@/components/home/PropertyHighlight';
import ExperienceCard from '@/components/home/ExperienceCard';
import TestimonialCard from '@/components/home/TestimonialCard';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSignup from '@/components/home/NewsletterSignup';

const Index = () => {
  // Sample data (would come from Supabase in the final implementation)
  const featuredExperiences = [
    {
      id: '1',
      title: 'Forest Hike & Meditation',
      description: 'Guided forest therapy with meditation and mindfulness practices in pristine wilderness.',
      imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'Wellness',
      duration: '3 hours',
      price: 89,
    },
    {
      id: '2',
      title: 'Wildlife Photography',
      description: 'Capture the beauty of local wildlife with expert photography guidance at dawn or dusk.',
      imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'Adventure',
      duration: '4 hours',
      price: 119,
    },
    {
      id: '3',
      title: 'Farm-to-Table Cooking',
      description: 'Learn to prepare delicious meals with fresh ingredients harvested from our on-site garden.',
      imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'Culinary',
      duration: '2.5 hours',
      price: 99,
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        
        {/* Features Section */}
        <section className="py-16 bg-haven-beige bg-opacity-30">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Why Choose Haven?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
                title="Unique Accommodation"
                description="Our custom-designed container home offers a perfect blend of comfort, sustainability, and immersion in nature."
              />
              <FeatureCard 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                }
                title="Curated Experiences"
                description="Discover nature through our thoughtfully designed outdoor activities led by passionate local experts."
              />
              <FeatureCard 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
                title="Sustainable Approach"
                description="We're committed to minimizing our environmental impact while maximizing your connection to the natural world."
              />
            </div>
          </div>
        </section>
        
        {/* Property Highlights */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Your Haven Awaits</h2>
            <div className="space-y-16">
              <PropertyHighlight 
                title="Luxury Container Home"
                description="Experience the perfect blend of modern comfort and rustic charm in our thoughtfully designed container home. With panoramic windows that frame breathtaking views, a fully equipped kitchen, luxurious bathroom, and a private deck for stargazing, our container home redefines eco-luxury."
                imageUrl="https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
              />
              <PropertyHighlight 
                title="Immersed in Nature"
                description="Situated on 5 acres of pristine woodland, our property offers the perfect balance of seclusion and accessibility. Wake up to birdsong, enjoy your morning coffee while watching deer graze nearby, and fall asleep to the gentle sounds of the forest."
                imageUrl="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
                reverse={true}
              />
            </div>
          </div>
        </section>
        
        {/* Experiences Section */}
        <section className="py-16 bg-haven-beige bg-opacity-30">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <h2 className="font-serif text-3xl font-bold">Featured Experiences</h2>
              <a href="/experiences" className="text-haven-green hover:text-opacity-80 font-medium mt-4 md:mt-0">
                View All Experiences →
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredExperiences.map((experience) => (
                <ExperienceCard 
                  key={experience.id}
                  id={experience.id}
                  title={experience.title}
                  description={experience.description}
                  imageUrl={experience.imageUrl}
                  category={experience.category}
                  duration={experience.duration}
                  price={experience.price}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">What Our Guests Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard 
                quote="Our stay at Haven was absolutely magical. The container home is beautifully designed, and the forest meditation experience was transformative."
                author="Sarah M."
                location="San Francisco, CA"
              />
              <TestimonialCard 
                quote="We loved everything about our stay! The wildlife photography experience helped me capture incredible shots, and the accommodations were perfect."
                author="James L."
                location="Portland, OR"
              />
              <TestimonialCard 
                quote="Haven is a truly special place. The cooking class was a highlight, and waking up surrounded by nature in such a comfortable space was unforgettable."
                author="Emily K."
                location="Seattle, WA"
              />
            </div>
          </div>
        </section>
        
        <CallToAction />
        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
};

export default Index;
