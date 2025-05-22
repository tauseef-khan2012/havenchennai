
import { Card, CardContent } from "@/components/ui/card";
import { Basketball, Cricket, Playground, Park } from "lucide-react";

interface FacilityCardProps {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

const FacilityCard = ({ title, description, image, icon }: FacilityCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-haven-green text-white p-2 rounded-full">
          {icon}
        </div>
      </div>
      <CardContent className="p-5 flex-grow">
        <h3 className="font-serif text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

const RecreationalFacilities = () => {
  const facilities = [
    {
      title: "Basketball Court",
      description: "Our full-size basketball court provides the perfect space for a friendly game or serious practice session.",
      image: "/lovable-uploads/7ef10cc7-1183-4067-8e12-ead8cd47788f.png",
      icon: <Basketball className="h-5 w-5" />
    },
    {
      title: "Cricket Net",
      description: "Perfect your bowling and batting skills in our professional cricket practice nets.",
      image: "/lovable-uploads/98e46d57-3441-4761-9cdf-18542ba4837c.png",
      icon: <Cricket className="h-5 w-5" />
    },
    {
      title: "Children's Playground",
      description: "A colorful playground with slides, swings, and climbing equipment to keep the little ones entertained.",
      image: "/lovable-uploads/d7acb4b7-3f86-425c-acc9-a34b740cb105.png",
      icon: <Playground className="h-5 w-5" />
    },
    {
      title: "Swings Area",
      description: "Relax and unwind on our swings while enjoying the beautiful surroundings.",
      image: "/lovable-uploads/d1148760-0de0-44d6-ae11-98a16c4b61fc.png",
      icon: <Playground className="h-5 w-5" />
    },
    {
      title: "Outdoor Fitness Area",
      description: "Stay fit with our range of outdoor fitness equipment designed for all ages and fitness levels.",
      image: "/lovable-uploads/ba10980e-eaed-41d2-950b-de5ba0f75e97.png",
      icon: <Park className="h-5 w-5" />
    },
    {
      title: "Walking Paths & Garden",
      description: "Scenic walking paths wind through our beautifully landscaped gardens, perfect for morning or evening strolls.",
      image: "/lovable-uploads/3d09a878-2b77-4c76-b9dc-916c5572305e.png",
      icon: <Park className="h-5 w-5" />
    },
  ];

  return (
    <section className="py-16 bg-haven-beige/20">
      <div className="container-custom">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Community Recreational Facilities</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Our property is part of a vibrant community that offers a wide range of recreational facilities for guests to enjoy. 
            From sports courts to children's play areas, there's something for everyone just steps away from your accommodation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <FacilityCard 
              key={index}
              title={facility.title}
              description={facility.description}
              image={facility.image}
              icon={facility.icon}
            />
          ))}
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-haven-green mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Access Information</h3>
              <p className="text-gray-600">
                All community facilities are available to our guests from 6:00 AM to 9:00 PM daily. 
                Some facilities may require prior booking during peak hours. Please inquire at check-in for the latest 
                information on facility availability and any scheduled maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecreationalFacilities;
