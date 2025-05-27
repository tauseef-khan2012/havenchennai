
import TestimonialCard from '@/components/testimonials/TestimonialCard';
import { Testimonial } from '@/data/testimonialsData';

// DEPRECATED: Use @/components/testimonials/TestimonialCard instead
interface OldTestimonialCardProps {
  quote: string;
  author: string;
  location: string;
}

const OldTestimonialCard = ({ quote, author, location }: OldTestimonialCardProps) => {
  // Convert old format to new format
  const testimonial: Testimonial = {
    id: `legacy-${author.replace(/\s/g, '-').toLowerCase()}`,
    quote,
    author,
    location,
    rating: 5,
    date: 'Legacy Review',
    category: 'overall',
    featured: false
  };

  return <TestimonialCard testimonial={testimonial} variant="default" />;
};

export default OldTestimonialCard;
