
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users } from 'lucide-react';
import { Experience } from '@/data/experiencesData';

interface BookingCardProps {
  experience: Experience;
}

const BookingCard = ({ experience }: BookingCardProps) => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-bold">₹{experience.price}</span>
          <span className="text-sm text-gray-500">per person</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-haven-green mr-2" />
            <span className="text-sm">{experience.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-haven-green mr-2" />
            <span className="text-sm">{experience.groupSize}</span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Available Days:</h4>
          <div className="flex flex-wrap gap-1">
            {experience.availability.map((day, index) => (
              <span key={index} className="text-xs bg-haven-green/10 text-haven-green px-2 py-1 rounded">
                {day}
              </span>
            ))}
          </div>
        </div>
        
        <Button className="w-full bg-haven-green hover:bg-haven-green/90">
          Book This Experience
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          Free cancellation up to 24 hours before the experience
        </p>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
