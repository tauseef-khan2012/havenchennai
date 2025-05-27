
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  category: 'stay' | 'experience' | 'overall';
  featured: boolean;
  avatar?: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: '1',
    quote: "The views from the rooftop deck were absolutely breathtaking. Watching the sunset over the lake was a highlight of our trip. Such a peaceful retreat!",
    author: "Ravi Kumar",
    location: "Chennai, India",
    rating: 5,
    date: "April 2025",
    category: 'stay',
    featured: true
  },
  {
    id: '2',
    quote: "The amenities were top-notch. From the premium coffee to the luxurious bed linens, every detail was thoughtfully curated. A perfect blend of comfort and style.",
    author: "Anika Patel",
    location: "Bangalore, India",
    rating: 5,
    date: "March 2025",
    category: 'stay',
    featured: true
  },
  {
    id: '3',
    quote: "The location is unbeatable. Close enough to attractions but secluded enough to feel like you're in your own world. The nearby trails were perfect for morning walks.",
    author: "Michael Rodriguez",
    location: "Mumbai, India",
    rating: 5,
    date: "May 2025",
    category: 'stay',
    featured: true
  },
  {
    id: '4',
    quote: "The kayaking experience was incredible! Our guide was knowledgeable and the equipment was top quality. Highly recommend for adventure enthusiasts.",
    author: "Sarah Chen",
    location: "Singapore",
    rating: 5,
    date: "April 2025",
    category: 'experience',
    featured: false
  },
  {
    id: '5',
    quote: "Haven exceeded all our expectations. The sustainable design, beautiful location, and exceptional service made our anniversary truly special.",
    author: "David & Emma Thompson",
    location: "Delhi, India",
    rating: 5,
    date: "February 2025",
    category: 'overall',
    featured: true
  },
  {
    id: '6',
    quote: "The container home is a marvel of design. Spacious, modern, and surprisingly comfortable. The integration with nature is seamless.",
    author: "Priya Sharma",
    location: "Hyderabad, India",
    rating: 5,
    date: "March 2025",
    category: 'stay',
    featured: false
  },
  {
    id: '7',
    quote: "Bird watching at dawn was magical. The diversity of species around the lake is remarkable. A paradise for nature lovers!",
    author: "Robert Wilson",
    location: "Pune, India",
    rating: 5,
    date: "January 2025",
    category: 'experience',
    featured: false
  },
  {
    id: '8',
    quote: "Our family loved every moment. The kids enjoyed the nature trails while we relaxed on the deck. Perfect for a multi-generational getaway.",
    author: "The Gupta Family",
    location: "Kolkata, India",
    rating: 5,
    date: "April 2025",
    category: 'overall',
    featured: false
  }
];

export const getFeaturedTestimonials = () => {
  return testimonialsData.filter(testimonial => testimonial.featured);
};

export const getTestimonialsByCategory = (category: Testimonial['category']) => {
  return testimonialsData.filter(testimonial => testimonial.category === category);
};

export const getRandomTestimonials = (count: number) => {
  const shuffled = [...testimonialsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
