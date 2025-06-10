
export interface Experience {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  category: string;
  duration: string;
  groupSize: string;
  price: number;
  availability: string[];
  includes: string[];
  rating: number;
  reviewCount: number;
  location: string;
}

export const experiencesData: Experience[] = [
  {
    id: "exp1",
    title: "Yoga Session on the Beach",
    description: "Start your day with a refreshing yoga session by the beach, with the sound of waves calming your mind.",
    longDescription: "Begin your morning with a transformative yoga experience on the pristine beaches of ECR. Our certified instructor will guide you through gentle flows and mindfulness practices as the sun rises over the Bay of Bengal. This session combines traditional Hatha and Vinyasa yoga techniques, perfectly suited for all skill levels. The sound of gentle waves and fresh ocean breeze creates an ideal environment for deep relaxation and spiritual connection. The session concludes with a meditation practice and healthy refreshments.",
    imageUrl: "/lovable-uploads/e4f31ab2-de64-417b-af9f-97d3d17e2f47.png",
    category: "Wellness",
    duration: "1 hour",
    groupSize: "Up to 8 guests",
    price: 1200,
    availability: ["Monday", "Wednesday", "Friday", "Saturday"],
    includes: [
      "Certified yoga instructor",
      "Yoga mats and props provided",
      "Beachside location setup",
      "Post-session herbal tea",
      "Digital guide for home practice"
    ],
    rating: 4.8,
    reviewCount: 124,
    location: "ECR Beach"
  },
  {
    id: "exp2",
    title: "Traditional South Indian Cooking Class",
    description: "Learn the art of traditional South Indian cooking from local experts. Take home recipes and memories.",
    longDescription: "Immerse yourself in the rich culinary traditions of Tamil Nadu with our hands-on cooking class. Led by local home chefs, you'll learn to prepare authentic dishes using traditional techniques passed down through generations. The class covers spice blending, dosa making, sambar preparation, and regional specialties. You'll work with fresh, locally-sourced ingredients and learn about the cultural significance of each dish. The experience includes a communal meal where you'll enjoy the fruits of your labor.",
    imageUrl: "/lovable-uploads/43aa0007-941b-4b51-b1a0-a2b67f4bc6d2.png",
    category: "Cultural",
    duration: "3 hours",
    groupSize: "Up to 6 guests",
    price: 1800,
    availability: ["Tuesday", "Thursday", "Saturday"],
    includes: [
      "Expert local chef instructor",
      "All ingredients and cooking utensils",
      "Recipe cards to take home",
      "Full meal of prepared dishes",
      "Spice kit as a souvenir"
    ],
    rating: 4.9,
    reviewCount: 86,
    location: "Haven Villa Kitchen"
  },
  {
    id: "exp3",
    title: "Sunset Kayaking Adventure",
    description: "Paddle through the beautiful backwaters of ECR during sunset for a memorable experience.",
    longDescription: "Experience the magic of Tamil Nadu's backwaters as you kayak through serene waterways during the golden hour. This guided adventure takes you through mangrove channels and calm lagoons, offering spectacular views of the sunset reflecting on the water. You'll have opportunities to spot local wildlife including kingfishers, herons, and occasionally dolphins in the distance. The tour includes safety briefing, equipment, and a traditional snack break on a secluded beach. Perfect for beginners and experienced paddlers alike.",
    imageUrl: "/lovable-uploads/3f68b7dc-fc1b-4cab-ac65-013e5c1e074f.png",
    category: "Adventure",
    duration: "2 hours",
    groupSize: "Up to 8 guests",
    price: 1500,
    availability: ["Wednesday", "Friday", "Saturday", "Sunday"],
    includes: [
      "Professional kayaking guide",
      "High-quality kayaks and safety gear",
      "Waterproof bag for belongings",
      "Traditional snacks and refreshments",
      "Photography service available"
    ],
    rating: 4.7,
    reviewCount: 92,
    location: "Kovalam Backwaters"
  },
  {
    id: "exp4",
    title: "Private Romantic Dinner by the Sea",
    description: "Enjoy a private candlelight dinner by the sea with your loved one. Includes a special menu and wine.",
    longDescription: "Create unforgettable memories with an intimate dining experience designed for couples. Set on a private stretch of beach with panoramic ocean views, this romantic dinner features a carefully curated menu of local and continental cuisines. The setting includes elegant table arrangements with candles, fairy lights, and fresh flowers. A personal chef will prepare your meal while a dedicated server ensures every detail is perfect. The experience includes welcome cocktails, a multi-course dinner, and live acoustic music upon request.",
    imageUrl: "/lovable-uploads/d1148760-0de0-44d6-ae11-98a16c4b61fc.png",
    category: "Couples",
    duration: "3 hours",
    groupSize: "2 guests",
    price: 4500,
    availability: ["Tuesday", "Thursday", "Friday", "Saturday"],
    includes: [
      "Private beachside setup",
      "Personal chef and server",
      "Welcome cocktails and wine selection",
      "Multi-course gourmet dinner",
      "Floral arrangements and ambient lighting",
      "Optional live acoustic music"
    ],
    rating: 4.9,
    reviewCount: 64,
    location: "Private Beach Spot"
  },
  {
    id: "exp5",
    title: "Ayurvedic Spa Retreat",
    description: "Indulge in a traditional Ayurvedic spa treatment that will rejuvenate your body and soul.",
    longDescription: "Restore your balance and vitality with authentic Ayurvedic treatments administered by certified practitioners. This comprehensive spa experience begins with a consultation to determine your dosha (body constitution) and customize treatments accordingly. Services include traditional oil massages, herbal steam therapy, and meditation guidance. All treatments use organic, locally-sourced herbs and oils. The serene environment is designed to promote deep relaxation and healing, making this perfect for stress relief and rejuvenation.",
    imageUrl: "/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png",
    category: "Wellness",
    duration: "2 hours",
    groupSize: "Up to 4 guests",
    price: 2800,
    availability: ["Monday", "Wednesday", "Friday", "Sunday"],
    includes: [
      "Certified Ayurvedic practitioner",
      "Personalized dosha consultation",
      "Traditional oil massage therapy",
      "Herbal steam treatment",
      "Organic herbal teas",
      "Take-home wellness guide"
    ],
    rating: 4.8,
    reviewCount: 116,
    location: "Haven Spa Center"
  },
  {
    id: "exp6",
    title: "Ancient Temple Tour",
    description: "Explore the ancient temples of Mahabalipuram with an expert guide who will share historical insights.",
    longDescription: "Journey through time as you explore the magnificent 7th-century rock-cut temples and sculptures of Mahabalipuram, a UNESCO World Heritage site. Led by an expert historian and archaeologist, this tour reveals the fascinating stories behind the Pallava dynasty's architectural marvels. You'll visit the Shore Temple, Five Rathas, Arjuna's Penance, and other iconic monuments while learning about ancient Tamil culture, Hindu mythology, and sculptural techniques. The tour includes transportation, entrance fees, and a traditional South Indian lunch.",
    imageUrl: "/lovable-uploads/a768b355-2a53-4898-91c5-3372bc1fe662.png",
    category: "Cultural",
    duration: "5 hours",
    groupSize: "Up to 10 guests",
    price: 2000,
    availability: ["Tuesday", "Thursday", "Saturday", "Sunday"],
    includes: [
      "Expert historian guide",
      "Air-conditioned transportation",
      "All entrance fees and permits",
      "Traditional South Indian lunch",
      "Historical photo documentation",
      "Cultural heritage guidebook"
    ],
    rating: 4.7,
    reviewCount: 78,
    location: "Mahabalipuram"
  }
];
