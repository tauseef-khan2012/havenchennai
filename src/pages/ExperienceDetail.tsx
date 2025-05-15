
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

// Sample data that would come from Supabase
const experiencesData = [
  {
    id: '1',
    title: 'Forest Hike & Meditation',
    description: 'Guided forest therapy with meditation and mindfulness practices in pristine wilderness.',
    longDescription: 'Immerse yourself in the healing power of nature with our certified forest therapy guide. This experience combines gentle hiking with guided meditation and mindfulness exercises designed to help you connect deeply with the natural world. Scientific studies have shown that forest bathing reduces stress hormones, lowers blood pressure, and boosts the immune system.',
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Wellness',
    duration: '3 hours',
    groupSize: 'Up to 8 guests',
    price: 89,
    availability: ['Monday', 'Wednesday', 'Saturday'],
    includes: [
      'Guided forest meditation',
      'Herbal tea ceremony',
      'Mindfulness journal',
      'Photos of your experience'
    ]
  },
  {
    id: '2',
    title: 'Wildlife Photography',
    description: 'Capture the beauty of local wildlife with expert photography guidance at dawn or dusk.',
    longDescription: 'Join our professional wildlife photographer for an unforgettable experience capturing the local fauna in their natural habitat. This workshop is suitable for all skill levels, from beginners to advanced photographers. Learn techniques for spotting animals, camera settings for different lighting conditions, and composition tips to create stunning wildlife images.',
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Adventure',
    duration: '4 hours',
    groupSize: 'Up to 6 guests',
    price: 119,
    availability: ['Tuesday', 'Thursday', 'Sunday'],
    includes: [
      'Photography instruction',
      'Use of professional lenses',
      'Breakfast or evening snacks',
      'Digital guide to wildlife photography'
    ]
  },
  {
    id: '3',
    title: 'Farm-to-Table Cooking',
    description: 'Learn to prepare delicious meals with fresh ingredients harvested from our on-site garden.',
    longDescription: 'Experience the joy of cooking with ingredients harvested just moments before from our organic garden. Our resident chef will guide you through the process of selecting the freshest seasonal produce and transforming it into a delicious meal. Learn knife skills, flavor pairing, and cooking techniques while enjoying the beautiful garden setting.',
    imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Culinary',
    duration: '2.5 hours',
    groupSize: 'Up to 8 guests',
    price: 99,
    availability: ['Wednesday', 'Friday', 'Saturday'],
    includes: [
      'Hands-on cooking instruction',
      'All ingredients and equipment',
      'Recipe booklet to take home',
      'Family-style meal with wine pairing'
    ]
  },
  {
    id: '4',
    title: 'Sunset Kayaking',
    description: 'Paddle on the tranquil lake as the sun sets, creating a magical atmosphere on the water.',
    longDescription: 'Glide across the calm waters of our nearby lake as the day transitions to evening and the sky transforms with spectacular colors. This guided kayaking experience is suitable for beginners and experienced paddlers alike. Learn proper kayaking techniques while enjoying the serenity of nature and possibly spotting wildlife coming to the shore at dusk.',
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Adventure',
    duration: '2 hours',
    groupSize: 'Up to 8 guests',
    price: 79,
    availability: ['Monday', 'Thursday', 'Saturday', 'Sunday'],
    includes: [
      'Kayak and safety equipment',
      'Basic paddling instruction',
      'Waterproof camera usage',
      'Hot drinks after the experience'
    ]
  },
  {
    id: '5',
    title: 'Stargazing & Astronomy',
    description: 'Explore the night sky with our astronomy expert using professional telescopes.',
    longDescription: 'Discover the wonders of the night sky far from city lights. Our astronomy expert will guide you through the constellations, planets, and deep sky objects visible during your stay. Using our professional telescope, you'll be able to observe celestial bodies in remarkable detail. Learn about the mythology behind the constellations and the science of the cosmos.',
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Educational',
    duration: '2 hours',
    groupSize: 'Up to 10 guests',
    price: 69,
    availability: ['Tuesday', 'Friday', 'Saturday'],
    includes: [
      'Use of professional telescope',
      'Star charts to take home',
      'Hot cocoa and snacks',
      'Digital photos of the night sky'
    ]
  },
  {
    id: '6',
    title: 'Artisan Craft Workshop',
    description: 'Create beautiful handmade items using traditional techniques and natural materials.',
    longDescription: 'Connect with your creative side in this hands-on workshop led by local artisans. Choose from pottery, weaving, or woodcarving sessions where you'll learn traditional techniques while creating a unique piece to take home. All materials are locally and sustainably sourced, and no prior experience is necessary.',
    imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Creative',
    duration: '3 hours',
    groupSize: 'Up to 6 guests',
    price: 109,
    availability: ['Wednesday', 'Thursday', 'Sunday'],
    includes: [
      'All materials and tools',
      'Instruction from local artisans',
      'Your handmade creation to take home',
      'Refreshments during the workshop'
    ]
  }
];

const ExperienceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Find the experience by ID
  const experience = experiencesData.find(exp => exp.id === id);
  
  if (!experience) {
    return (
      <>
        <Navbar />
        <div className="container-custom py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Experience not found</h2>
          <p className="mb-6">The experience you're looking for doesn't exist or has been removed.</p>
          <Link to="/experiences">
            <Button>Back to All Experiences</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }
  
  const handleBooking = () => {
    // Here you would connect to Supabase to book the experience
    toast({
      title: "Success!",
      description: "Your experience booking request has been submitted. We'll contact you shortly to confirm.",
    });
  };
  
  // Find related experiences (same category)
  const relatedExperiences = experiencesData
    .filter(exp => exp.category === experience.category && exp.id !== experience.id)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-black overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${experience.imageUrl})`,
              filter: 'brightness(0.6)'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="relative h-full container-custom flex flex-col justify-center">
            <div className="max-w-2xl animate-fade-up">
              <Badge className="mb-4 bg-haven-green text-white px-3 py-1 text-sm">{experience.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{experience.title}</h1>
              <p className="text-xl text-white">{experience.description}</p>
            </div>
          </div>
        </section>
        
        {/* Experience Details */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <h2 className="font-serif text-3xl font-bold mb-6">About This Experience</h2>
                <p className="text-gray-700 mb-8">{experience.longDescription}</p>
                
                <h3 className="font-serif text-xl font-semibold mb-4">What's Included</h3>
                <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2 mb-8">
                  {experience.includes.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="font-serif text-xl font-semibold mb-4">Available Days</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                    const isAvailable = experience.availability.includes(day);
                    return (
                      <div 
                        key={day}
                        className={`px-4 py-2 rounded-md border ${
                          isAvailable 
                            ? 'border-haven-green bg-haven-green bg-opacity-10 text-haven-green' 
                            : 'border-gray-200 bg-gray-50 text-gray-400'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                
                <h3 className="font-serif text-xl font-semibold mb-4">Important Details</h3>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                  <div>
                    <p className="font-medium mb-1">What to Bring</p>
                    <p className="text-gray-600">Comfortable clothing, water bottle, and your sense of adventure!</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Fitness Level</p>
                    <p className="text-gray-600">Suitable for all fitness levels. No prior experience required.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Age Restrictions</p>
                    <p className="text-gray-600">This experience is suitable for guests 12 years and older.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Weather Policy</p>
                    <p className="text-gray-600">Experiences may be rescheduled in case of severe weather conditions.</p>
                  </div>
                </div>
              </div>
              
              {/* Booking Card */}
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <div className="mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-xl font-semibold">Book This Experience</h3>
                      <Badge className="bg-haven-green">{experience.category}</Badge>
                    </div>
                    <p className="text-2xl font-bold mt-2">${experience.price} <span className="text-sm font-normal text-gray-600">per person</span></p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span>Duration</span>
                      <span className="font-medium">{experience.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Group Size</span>
                      <span className="font-medium">{experience.groupSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Language</span>
                      <span className="font-medium">English</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full btn-primary mb-4"
                    onClick={handleBooking}
                  >
                    Book Now
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    <p>Need a custom date or private experience?</p>
                    <Link to="/packages" className="text-haven-green hover:underline font-medium">
                      Contact us for a customized package
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Experiences */}
        {relatedExperiences.length > 0 && (
          <section className="py-12 bg-haven-beige bg-opacity-30">
            <div className="container-custom">
              <h2 className="font-serif text-2xl font-bold mb-8">Similar Experiences You Might Enjoy</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedExperiences.map(related => (
                  <Link 
                    to={`/experiences/${related.id}`} 
                    key={related.id}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={related.imageUrl} 
                          alt={related.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <Badge className="absolute top-3 left-3 bg-haven-green">{related.category}</Badge>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-haven-green transition-colors">{related.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">{related.description}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="text-sm text-gray-500">{related.duration}</span>
                          <span className="font-semibold">${related.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ExperienceDetail;
