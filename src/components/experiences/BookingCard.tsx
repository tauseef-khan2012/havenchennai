
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Experience } from '@/data/experiencesData';

interface BookingCardProps {
  experience: Experience;
}

const BookingCard = ({ experience }: BookingCardProps) => {
  const { toast } = useToast();

  const handleBooking = () => {
    // Here you would connect to Supabase to book the experience
    toast({
      title: "Success!",
      description: "Your experience booking request has been submitted. We'll contact you shortly to confirm.",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-xl font-semibold">Book This Experience</h3>
          <Badge className="bg-haven-green">{experience.category}</Badge>
        </div>
        <p className="text-2xl font-bold mt-2">${experience.price} <span className="text-sm font-normal text-gray-600">per person</span></p>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span>Duration</span>
          <span className="font-medium">{experience.duration}</span>
        </div>
        <div className="flex justify-between">
          <span>Group Size</span>
          <span className="font-medium">{experience.groupSize}</span>
        </div>
        <div className="flex justify-between">
          <span>Language</span>
          <span className="font-medium">English</span>
        </div>
      </div>
      
      <Button 
        className="w-full btn-primary mb-4"
        onClick={handleBooking}
      >
        Book Now
      </Button>
      
      <div className="text-center text-sm text-gray-600">
        <p>Need a custom date or private experience?</p>
        <Link to="/packages" className="text-haven-green hover:underline font-medium">
          Contact us for a customized package
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
