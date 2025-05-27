
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const MasonryGallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const images = [
    {
      src: '/lovable-uploads/fdf4ae09-782a-476b-b866-173bf4816200.png',
      alt: 'Rooftop Deck Panoramic Views',
      title: 'Rooftop Deck Views'
    },
    {
      src: '/lovable-uploads/dca2b7eb-af54-4c6e-8739-8add4f661dba.png',
      alt: 'Sunset from Upper Deck',
      title: 'Golden Hour Magic'
    },
    {
      src: '/lovable-uploads/54bc279a-b178-45ae-a1a2-5d06ad1c435d.png',
      alt: 'Rooftop Deck Night Views',
      title: 'Evening Serenity'
    },
    {
      src: '/lovable-uploads/d62143b5-3f29-4040-9d6c-f00ea43f861e.png',
      alt: 'Multi-level Deck Overview',
      title: 'Multi-Level Living'
    },
    {
      src: '/lovable-uploads/44941cd5-2bc4-4e82-8698-7916b158ebd5.png',
      alt: 'Ground Level Deck & Entrance',
      title: 'Ground Floor Deck'
    },
    {
      src: '/lovable-uploads/a768b355-2a53-4898-91c5-3372bc1fe662.png',
      alt: 'Container Home Exterior',
      title: 'Haven Exterior'
    },
    {
      src: '/lovable-uploads/913eeb57-1adb-4da7-a61b-ba718b4849d7.png',
      alt: 'Ground Floor Deck with Gardens',
      title: 'Garden Deck Views'
    },
    {
      src: '/lovable-uploads/4d8ae28d-5b42-4bd6-9ed3-83acb04bb29b.png',
      alt: 'First Floor Deck Views',
      title: 'First Floor Deck'
    }
  ];

  const openModal = (src: string, title: string) => {
    setSelectedImage(src);
    setSelectedTitle(title);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedTitle('');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl font-bold mb-4">Visual Journey</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Discover the beauty of our container home through these carefully curated moments. 
            From stunning deck views to peaceful interior spaces, every corner tells a story.
          </p>
        </motion.div>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="break-inside-avoid cursor-pointer group"
              onClick={() => openModal(image.src, image.title)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">{image.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          <DialogTitle className="sr-only">{selectedTitle}</DialogTitle>
          <div className="relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt={selectedTitle}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MasonryGallery;
