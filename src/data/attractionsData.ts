
import { Attraction } from '@/types/location';

export const attractions: Attraction[] = [
  {
    name: 'Muttukadu Boat House',
    distance: '5 min drive',
    description: 'Enjoy boating activities on the backwaters. The boathouse offers pedal boats, motor boats, and rowing boats for a fun day on the water.',
    image: '/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png',
    coordinates: { lat: 12.8152, lng: 80.2478 },
    website: 'https://tntoursim.com/muttukadu-boathouse'
  },
  {
    name: 'Dakshinachitra Heritage Museum',
    distance: '10 min drive',
    description: 'A living museum that showcases the traditional arts, crafts, and architecture of South India. Experience cultural performances and artisan demonstrations.',
    image: '/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png',
    coordinates: { lat: 12.8256, lng: 80.2387 },
    website: 'https://dakshinachitra.net'
  },
  {
    name: 'Mahabalipuram UNESCO Sites',
    distance: '15 min drive',
    description: "Explore the famous Shore Temple, Arjuna's Penance, and other 7th-century rock-cut monuments that are UNESCO World Heritage sites.",
    image: '/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png',
    coordinates: { lat: 12.6269, lng: 80.1928 },
    website: 'https://whc.unesco.org/en/list/249'
  },
  {
    name: 'Crocodile Bank',
    distance: '10 min drive',
    description: 'One of the largest reptile zoos in the world, home to over 2,000 crocodiles from 14 different species. Learn about conservation efforts.',
    image: '/lovable-uploads/6f37f539-1310-49d2-965a-0c02228f5ced.png',
    coordinates: { lat: 12.7703, lng: 80.2528 },
    website: 'https://www.madrascrocodilebank.org'
  }
];

// Animation variants - used across components
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
