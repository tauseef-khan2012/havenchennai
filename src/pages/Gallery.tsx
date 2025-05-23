
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

// Mock gallery data - replace with real data from your CMS/database
const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: '1',
    src: '/lovable-uploads/ba10980e-eaed-41d2-950b-de5ba0f75e97.png',
    alt: 'Haven container home exterior view',
    title: 'Container Home Exterior',
    category: 'Exterior Views',
    date: '2024-01-15',
    description: 'Beautiful exterior view of our sustainable container home'
  },
  {
    id: '2',
    src: '/lovable-uploads/deda06e0-1382-4f56-875d-f5715e78fc08.png',
    alt: 'Haven container home deck area',
    title: 'Deck & Outdoor Living',
    category: 'Exterior Views',
    date: '2024-01-20',
    description: 'Spacious deck perfect for relaxation and entertainment'
  },
  {
    id: '3',
    src: '/lovable-uploads/d2fe6d2c-b060-49a3-99d0-62891571bc97.png',
    alt: 'Haven container home interior',
    title: 'Modern Interior Design',
    category: 'Interior Spaces',
    date: '2024-02-01',
    description: 'Thoughtfully designed interior spaces with modern amenities'
  },
  {
    id: '4',
    src: '/lovable-uploads/e017493d-c2c0-467e-a191-28fe62a406ab.png',
    alt: 'Haven container home kitchen',
    title: 'Gourmet Kitchen',
    category: 'Interior Spaces',
    date: '2024-02-05',
    description: 'Fully equipped kitchen with high-end appliances'
  },
  {
    id: '5',
    src: '/lovable-uploads/c23dc9bb-c7f4-47d3-8c31-2c792d241ee2.png',
    alt: 'Haven outdoor activities',
    title: 'Outdoor Adventures',
    category: 'Activities',
    date: '2024-02-10',
    description: 'Endless outdoor activities in pristine natural surroundings'
  },
  {
    id: '6',
    src: '/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png',
    alt: 'Haven sunset view',
    title: 'Spectacular Sunsets',
    category: 'Surrounding Area',
    date: '2024-02-15',
    description: 'Breathtaking sunset views from your private haven'
  }
];

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<GalleryFilters>({ categories: [] });
  const [currentSort, setCurrentSort] = useState<GallerySortOption>({ field: 'date', direction: 'desc' });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Filter and sort images
  const filteredAndSortedImages = useMemo(() => {
    let filtered = GALLERY_IMAGES.filter(image => {
      // Search filter
      const matchesSearch = !searchQuery || 
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchQuery.toLowerCase());

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
          subtitle="Discover the beauty of Haven through our curated collection of images"
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
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                          <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                            <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                            <p className="text-sm">{image.category}</p>
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
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                        <p className="text-sm opacity-90 mb-1">{image.category}</p>
                        {image.description && (
                          <p className="text-sm opacity-80">{image.description}</p>
                        )}
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
        </div>
      </main>
      <Footer />
    </ErrorBoundary>
  );
};

export default Gallery;
