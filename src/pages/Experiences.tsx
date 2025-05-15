
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

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

const Experiences = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Get unique categories for filter
  const categories = ['All', ...new Set(experiencesData.map(exp => exp.category))];
  
  // Filter experiences based on search and category
  const filteredExperiences = experiencesData.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         experience.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || experience.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-black overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
              filter: 'brightness(0.6)'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="relative h-full container-custom flex flex-col justify-center">
            <div className="max-w-2xl animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Outdoor Experiences</h1>
              <p className="text-xl text-white">Discover unique activities led by our passionate local experts.</p>
            </div>
          </div>
        </section>
        
        {/* Filtering and Search */}
        <section className="py-8 bg-haven-beige bg-opacity-20">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-auto flex-1 max-w-md">
                <Input
                  type="search"
                  placeholder="Search experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={selectedCategory === category ? "bg-haven-green hover:bg-haven-green/90" : ""}
                    onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Experiences Listing */}
        <section className="py-16">
          <div className="container-custom">
            {filteredExperiences.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No experiences found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExperiences.map(experience => (
                  <Link 
                    to={`/experiences/${experience.id}`} 
                    key={experience.id}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={experience.imageUrl} 
                          alt={experience.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <Badge className="absolute top-3 left-3 bg-haven-green">{experience.category}</Badge>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-haven-green transition-colors">{experience.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">{experience.description}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="text-sm text-gray-500">{experience.duration}</span>
                          <span className="font-semibold">${experience.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Info Section */}
        <section className="py-12 bg-haven-green text-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold mb-4">Our Experience Philosophy</h2>
                <p className="mb-4">
                  At Haven, we believe that meaningful connections with nature and local culture are essential 
                  for a truly transformative stay. Our experiences are carefully crafted to be:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Authentic</strong> - Created and led by passionate local experts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Immersive</strong> - Designed for deep connection with nature</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Sustainable</strong> - Respectful of the environment and local communities</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Small-Group</strong> - Limited to ensure personal attention and minimal impact</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Nature experiences" 
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Experiences;
