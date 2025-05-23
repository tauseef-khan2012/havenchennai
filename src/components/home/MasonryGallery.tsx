import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getNetworkAwareImageUrl } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LazyImage from '@/components/shared/LazyImage';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  lowResSrc?: string;
  section: 'interiors' | 'lakeside' | 'highlights';
  width: number;
  height: number;
}

// We're keeping the home gallery smaller for performance
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
];

const MasonryGallery = () => {
  const [activeSection, setActiveSection] = useState<'all' | 'interiors' | 'lakeside' | 'highlights'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  const filteredImages = activeSection === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.section === activeSection);
  
  const sectionLabels = {
    all: 'All Photos',
    interiors: 'Container Interiors',
    lakeside: 'Lakeside & Deck Life',
    highlights: 'ECR & Chennai Highlights'
  };
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-haven-dark text-center mb-4">
          Gallery: Haven Moments
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
          Explore our container home's unique design, lakeside views, and nearby attractions through these captivating images.
        </p>
        
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {Object.entries(sectionLabels).map(([key, label]) => (
              <button
                key={key}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSection === key
                    ? 'bg-haven-teal text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setActiveSection(key as any)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
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
        
        <div className="text-center mt-10">
          <Link to="/gallery" className="inline-flex items-center text-haven-teal hover:underline font-medium">
            View Full Gallery <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
      
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
    </section>
  );
};

export default MasonryGallery;
