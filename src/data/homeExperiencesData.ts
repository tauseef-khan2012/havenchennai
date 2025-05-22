
export interface HomeExperience {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  category: string;
  imageUrl: string;
  location: string;
}

export const homeExperiences: HomeExperience[] = [
  {
    id: "exp1",
    title: "Yoga Session on the Beach",
    description: "Start your day with a refreshing yoga session by the beach, with the sound of waves calming your mind.",
    price: 1200,
    rating: 4.8,
    reviewCount: 124,
    duration: "1 hour",
    category: "Wellness",
    imageUrl: "/lovable-uploads/e4f31ab2-de64-417b-af9f-97d3d17e2f47.png",
    location: "ECR Beach"
  },
  {
    id: "exp2",
    title: "Traditional South Indian Cooking Class",
    description: "Learn the art of traditional South Indian cooking from local experts. Take home recipes and memories.",
    price: 1800,
    rating: 4.9,
    reviewCount: 86,
    duration: "3 hours",
    category: "Cultural",
    imageUrl: "/lovable-uploads/43aa0007-941b-4b51-b1a0-a2b67f4bc6d2.png",
    location: "Haven Villa Kitchen"
  },
  {
    id: "exp3",
    title: "Sunset Kayaking Adventure",
    description: "Paddle through the beautiful backwaters of ECR during sunset for a memorable experience.",
    price: 1500,
    rating: 4.7,
    reviewCount: 92,
    duration: "2 hours",
    category: "Adventure",
    imageUrl: "/lovable-uploads/3f68b7dc-fc1b-4cab-ac65-013e5c1e074f.png",
    location: "Kovalam Backwaters"
  },
  {
    id: "exp4",
    title: "Private Romantic Dinner by the Sea",
    description: "Enjoy a private candlelight dinner by the sea with your loved one. Includes a special menu and wine.",
    price: 4500,
    rating: 4.9,
    reviewCount: 64,
    duration: "3 hours",
    category: "Couples",
    imageUrl: "/lovable-uploads/d1148760-0de0-44d6-ae11-98a16c4b61fc.png",
    location: "Private Beach Spot"
  },
  {
    id: "exp5",
    title: "Ayurvedic Spa Retreat",
    description: "Indulge in a traditional Ayurvedic spa treatment that will rejuvenate your body and soul.",
    price: 2800,
    rating: 4.8,
    reviewCount: 116,
    duration: "2 hours",
    category: "Wellness",
    imageUrl: "/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png",
    location: "Haven Spa Center"
  },
  {
    id: "exp6",
    title: "Ancient Temple Tour",
    description: "Explore the ancient temples of Mahabalipuram with an expert guide who will share historical insights.",
    price: 2000,
    rating: 4.7,
    reviewCount: 78,
    duration: "5 hours",
    category: "Cultural",
    imageUrl: "/lovable-uploads/a768b355-2a53-4898-91c5-3372bc1fe662.png",
    location: "Mahabalipuram"
  }
];
