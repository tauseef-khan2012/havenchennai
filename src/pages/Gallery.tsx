import { useState, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LazyImage from '@/components/shared/LazyImage';
import GallerySearch from '@/components/gallery/GallerySearch';

// Use the same interface from MasonryGallery for consistency
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  lowResSrc?: string;
  section: 'interiors' | 'lakeside' | 'highlights';
  width: number;
  height: number;
}

// Expanded gallery images collection with all uploaded images
const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: '/lovable-uploads/d1148760-0de0-44d6-ae11-98a16c4b61fc.png',
    alt: 'Container interior workspace with natural light',
    section: 'interiors',
    width: 4,
    height: 3
  },
  {
    id: '2',
    src: '/lovable-uploads/e4f31ab2-de64-417b-af9f-97d3d17e2f47.png',
    alt: 'Bedroom with minimalist design and large window',
    section: 'interiors',
    width: 4,
    height: 3
  },
  {
    id: '3',
    src: '/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png',
    alt: 'Panoramic view of Muttukadu Lake from deck',
    section: 'lakeside',
    width: 6,
    height: 4
  },
  {
    id: '4',
    src: '/lovable-uploads/2d7b66e7-63b3-4b13-a6f3-9d253a5609aa.png',
    alt: 'Sunset view from rooftop deck',
    section: 'lakeside',
    width: 6,
    height: 4
  },
  {
    id: '5',
    src: '/lovable-uploads/a768b355-2a53-4898-91c5-3372bc1fe662.png',
    alt: 'Container home exterior during golden hour',
    section: 'interiors',
    width: 4,
    height: 3
  },
  {
    id: '6',
    src: '/lovable-uploads/ea3b40a2-e087-4627-aecc-211b123dc269.png',
    alt: 'Deck with outdoor furniture overlooking lake',
    section: 'lakeside',
    width: 4,
    height: 3
  },
  {
    id: '7',
    src: '/lovable-uploads/deda06e0-1382-4f56-875d-f5715e78fc08.png',
    alt: 'Morning mist over Muttukadu Lake',
    section: 'lakeside',
    width: 4,
    height: 3
  },
  {
    id: '8',
    src: '/lovable-uploads/8446db9f-ec1d-4876-adb8-84f568a58892.png',
    alt: 'Shore Temple at Mahabalipuram',
    section: 'highlights',
    width: 4,
    height: 3
  },
  {
    id: '9',
    src: '/lovable-uploads/3d09a878-2b77-4c76-b9dc-916c5572305e.png',
    alt: 'Boating at Muttukadu backwaters',
    section: 'highlights',
    width: 4,
    height: 3
  },
  // Additional uploaded images
  {
    id: '10',
    src: '/lovable-uploads/0f776507-f284-4d7c-9893-068e9aafd374.png',
    alt: 'Cozy reading nook in the container home',
    section: 'interiors',
    width: 4,
    height: 3
  },
  {
    id: '11',
    src: '/lovable-uploads/15811ea8-1b7c-41c0-9b75-05f249f60154.png',
    alt: 'Outdoor dining setup on the lakeside deck',
    section: 'lakeside',
    width: 4,
    height: 3
  },
  {
    id: '12',
    src: '/lovable-uploads/15b485a2-1d79-4783-ba80-f0cf6d9d7a20.png',
    alt: 'Sunrise view from the container home bedroom',
    section: 'lakeside',
    width: 4,
    height: 3
  },
  {
    id: '13',
    src: '/lovable-uploads/3f68b7dc-fc1b-4cab-ac65-013e5c1e074f.png',
    alt: 'Kitchen area with modern appliances',
    section: 'interiors',
    width: 4,
    height: 3
  },
  {
    id: '14',
    src: '/lovable-uploads/43aa0007-941b-4b51-b1a0-a2b67f4bc6d2.png',
    alt: 'Birds flying over Muttukadu Lake at dusk',
    section: 'lakeside',
    width: 6,
    height: 4
  },
  {
    id: '15',
    src: '/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png',
    alt: 'Crocodile Bank attraction near the property',
    section: 'highlights',
    width: 4,
    height: 3
  },
  {
    id: '16',
    src: '/lovable-uploads/7ef10cc7-1183-4067-8e12-ead8cd47788f.png',
    alt: 'Local fishermen on traditional boats',
    section: 'highlights',
    width: 4,
    height: 3
  },
  {
    id: '17',
    src: '/lovable-uploads/98e46d57-3441-4761-9cdf-18542ba4837c.png',
    alt: 'Bathroom with eco-friendly fixtures',
    section: 'interiors',
    width: 3,
    height: 4
  },
  {
    id: '18',
    src: '/lovable-uploads/ba10980e-eaed-41d2-950b-de5ba0f75e97.png',
    alt: 'Sunset kayaking experience on Muttukadu Lake',
    section: 'highlights',
    width: 4,
    height: 3
  },
  {
    id: '19',
    src: '/lovable-uploads/c23dc9bb-c7f4-47d3-8c31-2c792d241ee2.png',
    alt: 'Living area with panoramic lake view',
    section: 'interiors',
    width: 4,
    height: 3
  },
  {
    id: '20',
    src: '/lovable-uploads/d2fe6d2c-b060-49a3-99d0-62891571bc97.png',
    alt: 'Container home at night with ambient lighting',
    section: 'interiors',
    width: 4,
    height: 3
  },
  {
    id: '21',
    src: '/lovable-uploads/d7acb4b7-3f86-425c-acc9-a34b740cb105.png',
    alt: 'Mahabalipuram dance festival, local attraction',
    section: 'highlights',
    width: 4,
    height: 3
  },
  {
    id: '22',
    src: '/lovable-uploads/e017493d-c2c0-467e-a191-28fe62a406ab.png',
    alt: 'Morning yoga session on the lakeside deck',
    section: 'lakeside',
    width: 4,
    height: 3
  }
];

const Gallery = () => {
  const [activeSection, setActiveSection] = useState<'all' | 'interiors' | 'lakeside' | 'highlights'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [viewStyle, setViewStyle] = useState<'grid' | 'masonry'>('masonry');
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(galleryImages);
  
  const handleFilteredImagesChange = useCallback((images: GalleryImage[]) => {
    setFilteredImages(images);
  }, []);
  
  return (
    <>
      <Navbar />
      <main>
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-haven-dark text-center mb-4">
              Our Gallery
            </h1>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
              Explore our container home's unique design, lakeside views, and nearby attractions through these captivating images.
            </p>
            
            {/* Search and Filter Component */}
            <div className="mb-8">
              <GallerySearch
                images={galleryImages}
                onFilteredImagesChange={handleFilteredImagesChange}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>
            
            {/* View Style Toggle */}
            <div className="flex justify-end mb-6">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={viewStyle === 'grid' ? 'border-haven-teal text-haven-teal' : ''}
                  onClick={() => setViewStyle('grid')}
                >
                  Grid View
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className={viewStyle === 'masonry' ? 'border-haven-teal text-haven-teal' : ''}
                  onClick={() => setViewStyle('masonry')}
                >
                  Masonry View
                </Button>
              </div>
            </div>
            
            {/* Gallery layout based on selected view */}
            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No images found matching your search.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setActiveSection('all');
                    // This will trigger the search component to clear filters
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : viewStyle === 'masonry' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredImages.map((image, index) => (
                  <div 
                    key={image.id}
                    className={`overflow-hidden rounded-lg cursor-pointer hover-lift ${
                      image.width > image.height ? 'row-span-1' : 'row-span-2'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <LazyImage 
                      src={image.src}
                      alt={image.alt}
                      aspectRatio="auto"
                      priority={index < 6} // Prioritize first 6 images
                      className="w-full h-full transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map((image, index) => (
                  <div 
                    key={image.id}
                    className="aspect-square overflow-hidden rounded-lg cursor-pointer hover-lift"
                    onClick={() => setSelectedImage(image)}
                  >
                    <LazyImage 
                      src={image.src}
                      alt={image.alt}
                      aspectRatio="square"
                      priority={index < 8} // Prioritize first 8 images
                      className="w-full h-full transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        {selectedImage && (
          <DialogContent className="max-w-5xl p-0 overflow-hidden">
            <div className="relative">
              <LazyImage 
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full max-h-[80vh] object-contain"
                priority={true}
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded text-sm">
                {selectedImage.alt}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      
      <Footer />
    </>
  );
};

export default Gallery;
