
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowRight, ArrowUp, ArrowLeft } from "lucide-react";

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
      description: "Professional outdoor basketball court with proper markings and hoops, perfect for friendly games or practice sessions with family and friends.",
      image: "/lovable-uploads/gsquare-basketball-court.jpg",
      icon: <ArrowDown className="h-5 w-5" />
    },
    {
      title: "Cricket Practice Net",
      description: "Dedicated cricket practice area with proper netting, ideal for improving your batting and bowling skills in a safe environment.",
      image: "/lovable-uploads/gsquare-cricket-net.jpg",
      icon: <ArrowRight className="h-5 w-5" />
    },
    {
      title: "Children's Adventure Playground",
      description: "Colorful and safe playground featuring slides, climbing structures, and play equipment designed to keep children entertained and active.",
      image: "/lovable-uploads/gsquare-playground-1.jpg",
      icon: <ArrowUp className="h-5 w-5" />
    },
    {
      title: "Additional Play Area",
      description: "Secondary playground space with different equipment and seating areas for parents, ensuring children have varied play experiences.",
      image: "/lovable-uploads/gsquare-playground-2.jpg",
      icon: <ArrowUp className="h-5 w-5" />
    },
    {
      title: "Garden Walkways",
      description: "Beautifully landscaped walking paths through manicured gardens, perfect for peaceful morning walks or evening strolls.",
      image: "/lovable-uploads/gsquare-garden-walkway.jpg",
      icon: <ArrowLeft className="h-5 w-5" />
    },
    {
      title: "Community Watchtower & Gardens",
      description: "Scenic watchtower area surrounded by well-maintained gardens and greenery, offering elevated views of the community.",
      image: "/lovable-uploads/gsquare-watchtower-garden.jpg",
      icon: <ArrowLeft className="h-5 w-5" />
    },
  ];

  return (
    <section className="py-16 bg-haven-beige/20">
      <div className="container-custom">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Gsquare Community Amenities</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Your stay includes access to our exclusive Gsquare community facilities. From sports courts to peaceful garden walks, 
            our well-maintained amenities offer something for every guest to enjoy during their visit.
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
              <h3 className="font-semibold mb-2">Gsquare Community Access</h3>
              <p className="text-gray-600">
                All Gsquare community facilities are available to our guests from 6:00 AM to 9:00 PM daily. 
                These amenities are shared with other community residents and maintained to high standards. 
                Please be respectful of the facilities and other users during your visit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecreationalFacilities;
