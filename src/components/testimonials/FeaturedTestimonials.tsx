
import { motion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';
import { getFeaturedTestimonials } from '@/data/testimonialsData';

const FeaturedTestimonials = () => {
  const featuredTestimonials = getFeaturedTestimonials().slice(0, 3);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl font-bold mb-4">Featured Guest Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover why guests choose Haven for their perfect getaway experience.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {featuredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <TestimonialCard testimonial={testimonial} variant="featured" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTestimonials;
