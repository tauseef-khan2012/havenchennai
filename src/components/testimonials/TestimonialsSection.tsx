
import { useState } from 'react';
import { motion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';
import { Button } from '@/components/ui/button';
import { testimonialsData, getTestimonialsByCategory, Testimonial } from '@/data/testimonialsData';

interface TestimonialsSectionProps {
  category?: Testimonial['category'];
  showFilters?: boolean;
  maxItems?: number;
  variant?: 'default' | 'compact' | 'featured';
  title?: string;
  subtitle?: string;
}

const TestimonialsSection = ({ 
  category,
  showFilters = false,
  maxItems,
  variant = 'default',
  title = "What Our Guests Say",
  subtitle = "Don't just take our word for it. Here's what our guests have to say about their experience."
}: TestimonialsSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Testimonial['category'] | 'all'>(category || 'all');
  const [showAll, setShowAll] = useState(false);

  const getFilteredTestimonials = () => {
    let filtered = selectedCategory === 'all' 
      ? testimonialsData 
      : getTestimonialsByCategory(selectedCategory);
    
    if (maxItems && !showAll) {
      filtered = filtered.slice(0, maxItems);
    }
    
    return filtered;
  };

  const filteredTestimonials = getFilteredTestimonials();
  const hasMore = maxItems && testimonialsData.length > maxItems && !showAll;

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {showFilters && (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex justify-center mb-8"
          >
            <div className="flex flex-wrap gap-2 bg-white p-2 rounded-lg shadow-sm">
              {[
                { key: 'all', label: 'All Reviews' },
                { key: 'stay', label: 'The Stay' },
                { key: 'experience', label: 'Experiences' },
                { key: 'overall', label: 'Overall' }
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(key as Testimonial['category'] | 'all')}
                  className={`transition-colors ${
                    selectedCategory === key 
                      ? 'bg-haven-green text-white' 
                      : 'text-gray-600 hover:text-haven-green'
                  }`}
                >
                  {label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        <div className={`grid gap-6 ${
          variant === 'compact' 
            ? 'md:grid-cols-2 lg:grid-cols-4' 
            : variant === 'featured'
            ? 'md:grid-cols-2 lg:grid-cols-3'
            : 'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <TestimonialCard testimonial={testimonial} variant={variant} />
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mt-8"
          >
            <Button 
              onClick={() => setShowAll(true)}
              variant="outline"
              className="border-haven-green text-haven-green hover:bg-haven-green hover:text-white"
            >
              View All Reviews
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
