
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
}

export const experiencesData: Experience[] = [
  {
    id: "1",
    title: "Forest Hike & Meditation",
    description: "Guided forest therapy with meditation and mindfulness practices in pristine wilderness.",
    longDescription: "Immerse yourself in the healing power of nature with our certified forest therapy guide. This experience combines gentle hiking with guided meditation and mindfulness exercises designed to help you connect deeply with the natural world. Scientific studies have shown that forest bathing reduces stress hormones, lowers blood pressure, and boosts the immune system.",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Wellness",
    duration: "3 hours",
    groupSize: "Up to 8 guests",
    price: 89,
    availability: ["Monday", "Wednesday", "Saturday"],
    includes: [
      "Guided forest meditation",
      "Herbal tea ceremony",
      "Mindfulness journal",
      "Photos of your experience"
    ]
  },
  {
    id: "2",
    title: "Wildlife Photography",
    description: "Capture the beauty of local wildlife with expert photography guidance at dawn or dusk.",
    longDescription: "Join our professional wildlife photographer for an unforgettable experience capturing the local fauna in their natural habitat. This workshop is suitable for all skill levels, from beginners to advanced photographers. Learn techniques for spotting animals, camera settings for different lighting conditions, and composition tips to create stunning wildlife images.",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Adventure",
    duration: "4 hours",
    groupSize: "Up to 6 guests",
    price: 119,
    availability: ["Tuesday", "Thursday", "Sunday"],
    includes: [
      "Photography instruction",
      "Use of professional lenses",
      "Breakfast or evening snacks",
      "Digital guide to wildlife photography"
    ]
  },
  {
    id: "3",
    title: "Farm-to-Table Cooking",
    description: "Learn to prepare delicious meals with fresh ingredients harvested from our on-site garden.",
    longDescription: "Experience the joy of cooking with ingredients harvested just moments before from our organic garden. Our resident chef will guide you through the process of selecting the freshest seasonal produce and transforming it into a delicious meal. Learn knife skills, flavor pairing, and cooking techniques while enjoying the beautiful garden setting.",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Culinary",
    duration: "2.5 hours",
    groupSize: "Up to 8 guests",
    price: 99,
    availability: ["Wednesday", "Friday", "Saturday"],
    includes: [
      "Hands-on cooking instruction",
      "All ingredients and equipment",
      "Recipe booklet to take home",
      "Family-style meal with wine pairing"
    ]
  },
  {
    id: "4",
    title: "Sunset Kayaking",
    description: "Paddle on the tranquil lake as the sun sets, creating a magical atmosphere on the water.",
    longDescription: "Glide across the calm waters of our nearby lake as the day transitions to evening and the sky transforms with spectacular colors. This guided kayaking experience is suitable for beginners and experienced paddlers alike. Learn proper kayaking techniques while enjoying the serenity of nature and possibly spotting wildlife coming to the shore at dusk.",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Adventure",
    duration: "2 hours",
    groupSize: "Up to 8 guests",
    price: 79,
    availability: ["Monday", "Thursday", "Saturday", "Sunday"],
    includes: [
      "Kayak and safety equipment",
      "Basic paddling instruction",
      "Waterproof camera usage",
      "Hot drinks after the experience"
    ]
  },
  {
    id: "5",
    title: "Stargazing & Astronomy",
    description: "Explore the night sky with our astronomy expert using professional telescopes.",
    longDescription: "Discover the wonders of the night sky far from city lights. Our astronomy expert will guide you through the constellations, planets, and deep sky objects visible during your stay. Using our professional telescope, you'll be able to observe celestial bodies in remarkable detail. Learn about the mythology behind the constellations and the science of the cosmos.",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Educational",
    duration: "2 hours",
    groupSize: "Up to 10 guests",
    price: 69,
    availability: ["Tuesday", "Friday", "Saturday"],
    includes: [
      "Use of professional telescope",
      "Star charts to take home",
      "Hot cocoa and snacks",
      "Digital photos of the night sky"
    ]
  },
  {
    id: "6",
    title: "Artisan Craft Workshop",
    description: "Create beautiful handmade items using traditional techniques and natural materials.",
    longDescription: "Connect with your creative side in this hands-on workshop led by local artisans. Choose from pottery, weaving, or woodcarving sessions where you'll learn traditional techniques while creating a unique piece to take home. All materials are locally and sustainably sourced, and no prior experience is necessary.",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Creative",
    duration: "3 hours",
    groupSize: "Up to 6 guests",
    price: 109,
    availability: ["Wednesday", "Thursday", "Sunday"],
    includes: [
      "All materials and tools",
      "Instruction from local artisans",
      "Your handmade creation to take home",
      "Refreshments during the workshop"
    ]
  }
];
