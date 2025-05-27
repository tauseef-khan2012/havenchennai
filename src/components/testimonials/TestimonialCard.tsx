
import { Star } from 'lucide-react';
import { Testimonial } from '@/data/testimonialsData';

interface TestimonialCardProps {
  testimonial: Testimonial;
  variant?: 'default' | 'compact' | 'featured';
}

const TestimonialCard = ({ testimonial, variant = 'default' }: TestimonialCardProps) => {
  const { quote, author, location, rating, date } = testimonial;
  
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-2">
          <div className="flex mr-2">{renderStars()}</div>
          <span className="text-gray-600 text-sm">{rating}.0</span>
        </div>
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">"{quote}"</p>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-haven-green rounded-full flex items-center justify-center text-white font-medium text-sm mr-2">
            {author.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-sm">{author}</p>
            <p className="text-gray-600 text-xs">{date}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="bg-gradient-to-br from-haven-beige/20 to-white p-8 rounded-xl shadow-lg border-2 border-haven-green/20">
        <div className="mb-6 text-haven-green">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        <div className="flex items-center justify-center mb-4">
          <div className="flex mr-2">{renderStars()}</div>
          <span className="text-gray-600 text-sm">{rating}.0</span>
        </div>
        <p className="text-gray-700 mb-6 italic text-lg text-center">"{quote}"</p>
        <div className="text-center">
          <p className="font-serif font-semibold text-lg">{author}</p>
          <p className="text-sm text-gray-500">{location}</p>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="flex mr-2">{renderStars()}</div>
        <span className="text-gray-600 text-sm">{rating}.0</span>
      </div>
      <p className="text-gray-700 mb-6 italic">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-haven-green rounded-full flex items-center justify-center text-white font-medium mr-3">
          {author.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-gray-600 text-sm">{location}</p>
          <p className="text-gray-500 text-xs">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
