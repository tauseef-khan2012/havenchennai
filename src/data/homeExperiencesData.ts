
export interface HomeExperience {
  id: string;
  title: string;
  hook: string;
  category: string;
  image: string;
  alt: string;
  story: string;
  travelTime: string;
}

export const homeExperiences: HomeExperience[] = [
  {
    id: '1',
    title: 'Mahabalipuram & Shore Temple',
    hook: 'Explore ancient UNESCO heritage sites',
    category: 'Cultural',
    image: '/lovable-uploads/8446db9f-ec1d-4876-adb8-84f568a58892.png',
    alt: 'Shore Temple at Mahabalipuram',
    story: 'Step back in time as you explore the magnificent 7th-century Shore Temple and the ancient rock-cut monuments of Mahabalipuram. This UNESCO World Heritage site showcases the remarkable Pallava dynasty architecture with its intricate carvings and historical significance. Don\'t miss the famous "Descent of the Ganges" rock relief, one of the largest open-air rock reliefs in the world.',
    travelTime: '30 minutes from Haven'
  },
  {
    id: '2',
    title: 'Muttukadu Boating',
    hook: 'Peaceful boat rides on the backwaters',
    category: 'Adventure',
    image: '/lovable-uploads/3d09a878-2b77-4c76-b9dc-916c5572305e.png',
    alt: 'Boating at Muttukadu backwaters',
    story: 'Experience the serene beauty of Muttukadu's expansive backwaters with a relaxing boat ride. Choose between motorboats, rowboats, or pedal boats as you glide across the calm waters surrounded by mangroves and wildlife. Perfect for photography enthusiasts and nature lovers, this activity provides a refreshing perspective of the coastal landscape.',
    travelTime: '5 minutes from Haven'
  },
  {
    id: '3',
    title: 'Sunrise Yoga & Meditation',
    hook: 'Greet the day with lakeside yoga',
    category: 'Wellness',
    image: '/lovable-uploads/d7acb4b7-3f86-425c-acc9-a34b740cb105.png',
    alt: 'Yoga session by Muttukadu Lake',
    story: 'Begin your day with a rejuvenating yoga and meditation session on our private deck overlooking Muttukadu Lake. Our experienced instructor guides you through gentle asanas and breathing techniques as the sun rises over the water. This peaceful practice allows you to connect with nature while finding your inner balance.',
    travelTime: 'On-site at Haven'
  },
  {
    id: '4',
    title: 'Crocodile Bank Visit',
    hook: 'Meet prehistoric reptiles up close',
    category: 'Adventure',
    image: '/lovable-uploads/3f68b7dc-fc1b-4cab-ac65-013e5c1e074f.png',
    alt: 'Crocodile at Madras Crocodile Bank',
    story: 'Discover one of the largest reptile zoos in the world at the Madras Crocodile Bank. Home to over 2,000 crocodiles, alligators, and other reptiles, this conservation center offers fascinating guided tours where you can learn about these prehistoric creatures. Don\'t miss the feeding sessions for an unforgettable experience!',
    travelTime: '15 minutes from Haven'
  },
  {
    id: '5',
    title: 'Beachside Dinner',
    hook: 'Romantic seafood feast by the ocean',
    category: 'Couples',
    image: '/lovable-uploads/43aa0007-941b-4b51-b1a0-a2b67f4bc6d2.png',
    alt: 'Beachside dinner setup near ECR',
    story: 'Indulge in a magical dining experience with your special someone right on the beach. We\'ll arrange a private table set against the backdrop of crashing waves and twinkling stars. Feast on freshly caught seafood prepared by local chefs while enjoying the gentle sea breeze and the sound of the ocean.',
    travelTime: '20 minutes from Haven'
  },
  {
    id: '6',
    title: 'Bird Watching Tour',
    hook: 'Spot migratory birds in their habitat',
    category: 'Adventure',
    image: '/lovable-uploads/ba10980e-eaed-41d2-950b-de5ba0f75e97.png',
    alt: 'Birds at Vedanthangal Bird Sanctuary',
    story: 'Join our expert naturalist for a guided bird watching tour around Muttukadu Lake and nearby wetlands. This area becomes a haven for numerous migratory and resident bird species. With binoculars provided, you\'ll observe painted storks, spot-billed pelicans, egrets, and many more in their natural habitat.',
    travelTime: '10-25 minutes from Haven'
  }
];
