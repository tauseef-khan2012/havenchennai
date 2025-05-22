
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
    title: "Lakeside Meditation & Yoga",
    description: "Begin your day with a peaceful meditation and yoga session beside the serene Muttukadu Lake.",
    longDescription: "Connect with nature through a guided meditation and yoga experience at dawn. Our certified instructor will lead you through mindfulness practices and gentle yoga poses designed to help you embrace the peaceful surroundings of Muttukadu Lake. The session concludes with a herbal tea ceremony on the deck as you watch the lake come alive with morning light and activity.",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Wellness",
    duration: "1.5 hours",
    groupSize: "Up to 6 guests",
    price: 799,
    availability: ["Tuesday", "Thursday", "Saturday"],
    includes: [
      "Guided meditation session",
      "Yoga instruction for all levels",
      "Yoga mats and props",
      "Herbal tea ceremony",
      "Digital guide to continue your practice"
    ]
  },
  {
    id: "2",
    title: "Birdwatching Safari",
    description: "Discover the rich birdlife of Muttukadu Lake, including pelicans, flamingos, herons, and exotic migratory birds.",
    longDescription: "Muttukadu Lake and its surroundings serve as a haven for diverse birdlife, making it a perfect spot for birdwatching enthusiasts. Join our experienced guide for an early morning excursion where you'll have the opportunity to spot pelicans, flamingos, herons, egrets, kingfishers, and various migratory birds. Learn about their habits, migration patterns, and ecological importance while capturing stunning photographs of these magnificent creatures in their natural habitat.",
    imageUrl: "https://images.unsplash.com/photo-1627495648022-5e935fe5c9d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Nature",
    duration: "3 hours",
    groupSize: "Up to 8 guests",
    price: 1499,
    availability: ["Wednesday", "Friday", "Sunday"],
    includes: [
      "Professional birdwatching guide",
      "Use of binoculars and spotting scopes",
      "Field guide to local birds",
      "Light breakfast and refreshments",
      "Transportation to premium birdwatching spots"
    ]
  },
  {
    id: "3",
    title: "Sustainable Container Living Workshop",
    description: "Learn about eco-friendly container home design and sustainable living practices at Haven.",
    longDescription: "Inspired by Haven's own container home design, this workshop explores the principles of sustainable living and innovative space utilization. Discover the story behind Haven's creation, the upcycling of shipping containers, and practical tips for incorporating sustainability into your daily life. The session includes a tour of Haven's container home, highlighting its unique features, eco-friendly elements, and clever space-saving solutions that harmonize with the natural surroundings.",
    imageUrl: "https://images.unsplash.com/photo-1566908829550-e6551b00979b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Educational",
    duration: "2 hours",
    groupSize: "Up to 10 guests",
    price: 999,
    availability: ["Monday", "Saturday"],
    includes: [
      "Guided tour of Haven's container home",
      "Interactive workshop on sustainable living",
      "Resource guide with practical tips",
      "Organic refreshments",
      "Discount voucher for a future stay"
    ]
  },
  {
    id: "4",
    title: "Sunset Kayaking Adventure",
    description: "Paddle through the tranquil waters of Muttukadu Lake as the sun sets, creating a magical atmosphere.",
    longDescription: "Experience the captivating beauty of Muttukadu Lake from a unique perspective as you glide across its calm waters in a kayak. This guided adventure takes you through scenic routes as the setting sun paints the sky with vibrant colors. Watch for birds returning to their nests and enjoy the peaceful transition from day to evening. Suitable for beginners and experienced paddlers alike, this experience offers the perfect blend of gentle activity and natural immersion.",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Adventure",
    duration: "2 hours",
    groupSize: "Up to 6 guests",
    price: 1299,
    availability: ["Tuesday", "Thursday", "Saturday", "Sunday"],
    includes: [
      "Kayaking equipment and safety gear",
      "Professional guide",
      "Basic paddling instruction",
      "Waterproof camera for photos",
      "Post-paddle refreshments on the deck"
    ]
  },
  {
    id: "5",
    title: "Stargazing & Night Sky Photography",
    description: "Observe the stars from Haven's rooftop deck and learn to capture the night sky with your camera.",
    longDescription: "Take advantage of Haven's minimal light pollution and panoramic rooftop deck for an unforgettable stargazing experience. Our astronomy expert will guide you through the constellations visible from this unique vantage point, sharing stories and scientific insights. Learn night photography techniques to capture the stars, moon, and potentially the Milky Way (depending on the season). The session includes hot beverages and comfortable seating to enhance your enjoyment of the night sky.",
    imageUrl: "https://images.unsplash.com/photo-1534418984967-97bbd51a96d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Educational",
    duration: "2.5 hours",
    groupSize: "Up to 8 guests",
    price: 1799,
    availability: ["Monday", "Wednesday", "Friday"],
    includes: [
      "Guided stargazing with an astronomy expert",
      "Use of telescope and star charts",
      "Night photography tutorial",
      "Hot chocolate and snacks",
      "Digital star map as a souvenir"
    ]
  },
  {
    id: "6",
    title: "Lakeside Culinary Experience",
    description: "Enjoy a private dining experience on Haven's deck with locally-sourced ingredients and lakeside views.",
    longDescription: "Indulge in a memorable dining experience on Haven's spacious deck, with the serene Muttukadu Lake as your backdrop. Our chef creates a custom menu featuring locally-sourced ingredients and regional flavors, adapted to your preferences. As the sun sets and lanterns illuminate the deck, you'll enjoy a multi-course meal accompanied by selected beverages. This intimate culinary journey combines exquisite food with Haven's unique ambiance for a truly special occasion.",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Culinary",
    duration: "3 hours",
    groupSize: "2-6 guests",
    price: 2499,
    availability: ["Wednesday", "Friday", "Saturday"],
    includes: [
      "Customized multi-course dinner",
      "Welcome drink and beverage pairings",
      "Private deck setting with ambient lighting",
      "Personal chef and service",
      "Digital recipe collection of featured dishes"
    ]
  }
];
