
import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/shared/PageHero';
import LazyImage from '@/components/shared/LazyImage';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingState } from '@/components/ui/loading-state';
import { GallerySearchAndFilter, GalleryFilters, GallerySortOption } from '@/components/gallery/GallerySearchAndFilter';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface GalleryImage {
  id: string;
  src: string;
  lowResSrc?: string;
  alt: string;
  title: string;
  category: string;
  date: string;
  description?: string;
}

// Comprehensive gallery data with all website images
const GALLERY_IMAGES: GalleryImage[] = [
  // Container Home & Accommodation
  {
    id: '1',
    src: '/lovable-uploads/ba10980e-eaed-41d2-950b-de5ba0f75e97.png',
    alt: 'Haven container home exterior view',
    title: 'Container Home Exterior',
    category: 'Accommodation',
    date: '2024-01-15',
    description: 'Beautiful exterior view of our sustainable container home surrounded by lush greenery'
  },
  {
    id: '2',
    src: '/lovable-uploads/deda06e0-1382-4f56-875d-f5715e78fc08.png',
    alt: 'Haven container home deck area',
    title: 'Spacious Deck & Outdoor Living',
    category: 'Accommodation',
    date: '2024-01-20',
    description: 'Expansive deck perfect for relaxation, entertainment, and enjoying nature'
  },
  {
    id: '3',
    src: '/lovable-uploads/d2fe6d2c-b060-49a3-99d0-62891571bc97.png',
    alt: 'Haven container home interior',
    title: 'Modern Interior Design',
    category: 'Interior Spaces',
    date: '2024-02-01',
    description: 'Thoughtfully designed interior spaces with contemporary amenities and comfort'
  },
  {
    id: '4',
    src: '/lovable-uploads/e017493d-c2c0-467e-a191-28fe62a406ab.png',
    alt: 'Haven container home kitchen',
    title: 'Fully Equipped Kitchen',
    category: 'Interior Spaces',
    date: '2024-02-05',
    description: 'State-of-the-art kitchen with premium appliances and modern fixtures'
  },
  {
    id: '5',
    src: '/lovable-uploads/457f5e29-0207-45d0-822a-6252f1d6f7da.png',
    alt: 'Queen bed and bunk bed with workspace',
    title: 'Queen + Bunk Bed & Workspace',
    category: 'Interior Spaces',
    date: '2024-02-08',
    description: 'Comfortable sleeping arrangements with dedicated workspace area'
  },
  {
    id: '6',
    src: '/lovable-uploads/5425331e-4704-48e6-913b-0d6a48d98aaf.png',
    alt: 'Kitchen and refrigerator setup',
    title: 'Kitchen & Refrigerator Setup',
    category: 'Interior Spaces',
    date: '2024-02-10',
    description: 'Complete kitchen setup with modern appliances and ample storage'
  },
  
  // Natural Environment & Surroundings
  {
    id: '7',
    src: '/lovable-uploads/c23dc9bb-c7f4-47d3-8c31-2c792d241ee2.png',
    alt: 'Haven outdoor activities and nature',
    title: 'Outdoor Adventures',
    category: 'Surrounding Area',
    date: '2024-02-15',
    description: 'Endless outdoor activities in pristine natural surroundings'
  },
  {
    id: '8',
    src: '/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png',
    alt: 'Spectacular sunset views',
    title: 'Breathtaking Sunsets',
    category: 'Surrounding Area',
    date: '2024-02-20',
    description: 'Magnificent sunset views from your private haven retreat'
  },
  
  // Experiences & Activities
  {
    id: '9',
    src: '/lovable-uploads/dca2b7eb-af54-4c6e-8739-8add4f661dba.png',
    alt: 'Beach yoga session at sunrise',
    title: 'Beach Yoga at Sunrise',
    category: 'Activities',
    date: '2024-03-01',
    description: 'Rejuvenating yoga sessions on pristine beaches during golden hour'
  },
  {
    id: '10',
    src: '/lovable-uploads/48a6c5c9-5933-485c-afb7-e8d547c1e02f.png',
    alt: 'Traditional South Indian cooking class',
    title: 'Cooking Class Experience',
    category: 'Activities',
    date: '2024-03-05',
    description: 'Learn authentic South Indian cuisine with local expert chefs'
  },
  {
    id: '11',
    src: '/lovable-uploads/44941cd5-2bc4-4e82-8698-7916b158ebd5.png',
    alt: 'Sunset kayaking in backwaters',
    title: 'Backwater Kayaking',
    category: 'Activities',
    date: '2024-03-10',
    description: 'Peaceful kayaking adventures through scenic backwater channels'
  },
  {
    id: '12',
    src: '/lovable-uploads/15811ea8-1b7c-41c0-9b75-05f249f60154.png',
    alt: 'Romantic candlelit dinner by the sea',
    title: 'Romantic Seaside Dining',
    category: 'Dining',
    date: '2024-03-15',
    description: 'Intimate dining experiences with ocean views and candlelit ambiance'
  },
  {
    id: '13',
    src: '/lovable-uploads/54bc279a-b178-45ae-a1a2-5d06ad1c435d.png',
    alt: 'Ayurvedic spa treatment session',
    title: 'Ayurvedic Spa Wellness',
    category: 'Activities',
    date: '2024-03-20',
    description: 'Traditional Ayurvedic spa treatments for complete rejuvenation'
  },
  {
    id: '14',
    src: '/lovable-uploads/51e2e8f4-cfbe-4d8c-81f2-ac28bc7d3f04.png',
    alt: 'Ancient temple tour at Mahabalipuram',
    title: 'Mahabalipuram Temple Tour',
    category: 'Activities',
    date: '2024-03-25',
    description: 'Explore ancient temples and UNESCO World Heritage sites'
  },
  
  // Additional Scenic Views
  {
    id: '15',
    src: '/lovable-uploads/0bf49c3a-e3e0-4828-badd-a492dc4dd957.png',
    alt: 'Scenic lakeside view',
    title: 'Tranquil Lakeside Views',
    category: 'Surrounding Area',
    date: '2024-04-01',
    description: 'Serene lake views offering peaceful moments and natural beauty'
  },
  {
    id: '16',
    src: '/lovable-uploads/2a5c57cf-1282-47ff-a275-377ce86959a5.png',
    alt: 'Coastal landscape and beaches',
    title: 'Pristine Coastal Beauty',
    category: 'Surrounding Area',
    date: '2024-04-05',
    description: 'Untouched coastal landscapes along Chennai\'s East Coast Road'
  },
  {
    id: '17',
    src: '/lovable-uploads/3f68b7dc-fc1b-4cab-ac65-013e5c1e074f.png',
    alt: 'Lush greenery and natural surroundings',
    title: 'Natural Green Oasis',
    category: 'Surrounding Area',
    date: '2024-04-10',
    description: 'Verdant landscapes and tropical vegetation surrounding the property'
  },
  {
    id: '18',
    src: '/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png',
    alt: 'ECR scenic drive views',
    title: 'East Coast Road Scenery',
    category: 'Surrounding Area',
    date: '2024-04-15',
    description: 'Picturesque views along the famous East Coast Road journey'
  },
  
  // Amenities & Features
  {
    id: '19',
    src: '/lovable-uploads/80ae807c-39e1-4519-b19a-ed92c4b221cd.png',
    alt: 'Modern amenities and facilities',
    title: 'Premium Amenities',
    category: 'Amenities',
    date: '2024-05-01',
    description: 'High-end amenities and facilities for a comfortable stay'
  },
  {
    id: '20',
    src: '/lovable-uploads/8446db9f-ec1d-4876-adb8-84f568a58892.png',
    alt: 'Outdoor recreational spaces',
    title: 'Recreation & Leisure',
    category: 'Amenities',
    date: '2024-05-05',
    description: 'Dedicated spaces for recreation and leisure activities'
  },
  {
    id: '21',
    src: '/lovable-uploads/98e46d57-3441-4761-9cdf-18542ba4837c.png',
    alt: 'Wellness and relaxation areas',
    title: 'Wellness Spaces',
    category: 'Amenities',
    date: '2024-05-10',
    description: 'Specially designed areas for wellness and relaxation'
  },
  {
    id: '22',
    src: '/lovable-uploads/a768b355-2a53-4898-91c5-3372bc1fe662.png',
    alt: 'Entertainment and common areas',
    title: 'Entertainment Zones',
    category: 'Amenities',
    date: '2024-05-15',
    description: 'Common areas designed for entertainment and social gatherings'
  }
];

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<GalleryFilters>({ categories: [] });
  const [currentSort, setCurrentSort] = useState<GallerySortOption>({ field: 'date', direction: 'desc' });
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort images
  const filteredAndSortedImages = useMemo(() => {
    let filtered = GALLERY_IMAGES.filter(image => {
      // Search filter
      const matchesSearch = !searchQuery || 
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = activeFilters.categories.length === 0 ||
        activeFilters.categories.includes(image.category);

      return matchesSearch && matchesCategory;
    });

    // Sort images
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (currentSort.field) {
        case 'name':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (currentSort.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchQuery, activeFilters, currentSort]);

  return (
    <ErrorBoundary>
      <Navbar />
      <main className="min-h-screen bg-haven-beige bg-opacity-10">
        <PageHero
          title="Gallery"
          subtitle="Explore the beauty of Haven through our comprehensive collection of images showcasing accommodation, experiences, and natural surroundings"
          backgroundImage="/lovable-uploads/ba10980e-eaed-41d2-950b-de5ba0f75e97.png"
        />
        
        <div className="container-custom py-16">
          {/* Search and Filter Controls */}
          <GallerySearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            totalResults={filteredAndSortedImages.length}
            className="mb-8"
          />

          {/* Loading State */}
          {isLoading && (
            <LoadingState 
              size="lg" 
              message="Loading gallery images..." 
              className="py-16"
            />
          )}

          {/* Gallery Grid */}
          {!isLoading && filteredAndSortedImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedImages.map((image) => (
                <Dialog key={image.id}>
                  <DialogTrigger asChild>
                    <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="aspect-square relative">
                        <LazyImage
                          src={image.src}
                          lowResSrc={image.lowResSrc}
                          alt={image.alt}
                          aspectRatio="square"
                          className="group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                          <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                            <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                            <p className="text-sm bg-haven-green/80 px-2 py-1 rounded">{image.category}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full p-0">
                    <div className="relative">
                      <LazyImage
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-auto max-h-[80vh] object-contain"
                        priority={true}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold">{image.title}</h3>
                          <span className="text-sm bg-haven-green px-2 py-1 rounded">{image.category}</span>
                        </div>
                        {image.description && (
                          <p className="text-sm opacity-90">{image.description}</p>
                        )}
                        <p className="text-xs opacity-70 mt-2">
                          {new Date(image.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredAndSortedImages.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          )}

          {/* Gallery Statistics */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-8 text-sm text-gray-600 bg-white rounded-lg px-6 py-3 shadow-sm">
              <div>
                <span className="font-semibold text-haven-green">{GALLERY_IMAGES.length}</span> Total Images
              </div>
              <div>
                <span className="font-semibold text-haven-green">
                  {new Set(GALLERY_IMAGES.map(img => img.category)).size}
                </span> Categories
              </div>
              <div>
                <span className="font-semibold text-haven-green">{filteredAndSortedImages.length}</span> Currently Showing
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </ErrorBoundary>
  );
};

export default Gallery;
