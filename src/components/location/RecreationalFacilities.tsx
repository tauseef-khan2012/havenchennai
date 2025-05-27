
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
      description: "Full-size outdoor basketball court with professional court markings and regulation hoop. Perfect for shooting practice or friendly games with family and friends.",
      image: "/lovable-uploads/51d8d134-5bce-4156-85fd-c88fc7b14d48.png",
      icon: <ArrowDown className="h-5 w-5" />
    },
    {
      title: "Cricket Practice Net",
      description: "Fully enclosed cricket practice area with professional netting, providing a safe environment for batting and bowling practice sessions.",
      image: "/lovable-uploads/125bfd54-c176-498d-9323-2f3b7ecc75d2.png",
      icon: <ArrowRight className="h-5 w-5" />
    },
    {
      title: "Adventure Playground with Slides",
      description: "Expansive children's playground featuring colorful slides, climbing frames, jungle gyms, and various play equipment designed for different age groups.",
      image: "/lovable-uploads/794709ae-2c87-4e95-acbc-a4152eefee94.png",
      icon: <ArrowUp className="h-5 w-5" />
    },
    {
      title: "Outdoor Fitness Equipment",
      description: "Community fitness area with outdoor exercise equipment including parallel bars, balance beams, and strength training apparatus for all fitness levels.",
      image: "/lovable-uploads/da37f6f9-60e4-49f3-b842-27ba863b0583.png",
      icon: <ArrowUp className="h-5 w-5" />
    },
    {
      title: "Children's Swing Area",
      description: "Dedicated swing area with multiple swings including regular and toddler-friendly options, surrounded by safe soft ground covering.",
      image: "/lovable-uploads/ba297785-c3c4-4932-8c30-622c28079cc0.png",
      icon: <ArrowLeft className="h-5 w-5" />
    },
    {
      title: "Garden Walkways & Watchtower",
      description: "Beautiful paved walkways through landscaped gardens leading to a scenic watchtower area, perfect for peaceful walks and community gatherings.",
      image: "/lovable-uploads/129b146d-f57b-4641-974a-137956647aa9.png",
      icon: <ArrowLeft className="h-5 w-5" />
    },
    {
      title: "Community Seating Areas",
      description: "Comfortable benches and seating areas throughout the community with decorative elements, providing perfect spots for relaxation and socializing.",
      image: "/lovable-uploads/2a5c57cf-1282-47ff-a275-377ce86959a5.png",
      icon: <ArrowDown className="h-5 w-5" />
    },
    {
      title: "Additional Play Equipment",
      description: "Extended playground area with see-saws, climbing structures, and various recreational equipment ensuring children have diverse play experiences.",
      image: "/lovable-uploads/b18347fb-c237-455a-8c2d-263429d76c23.png",
      icon: <ArrowRight className="h-5 w-5" />
    },
  ];

  return (
    <section className="py-16 bg-haven-beige/20">
      <div className="container-custom">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Gsquare Community Amenities</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Your stay includes access to our extensive Gsquare community facilities. From sports courts and fitness equipment 
            to children's playgrounds and peaceful garden walks, our well-maintained amenities offer something for every guest 
            to enjoy during their visit.
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
                These amenities are shared with other community residents and are maintained to high standards. 
                Please be respectful of the facilities and follow community guidelines during your visit. 
                The community features over 8 different recreational areas including sports courts, multiple playgrounds, 
                fitness equipment, and beautiful landscaped walking areas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecreationalFacilities;
