
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Users } from 'lucide-react';
import { Experience } from '@/data/experiencesData';

interface ExperienceDetailsProps {
  experience: Experience;
}

const ExperienceDetails = ({ experience }: ExperienceDetailsProps) => {
  return (
    <div className="md:col-span-2">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Badge className="bg-haven-green">{experience.category}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium ml-1">{experience.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({experience.reviewCount} reviews)</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-haven-green mr-2" />
            <span className="text-sm">{experience.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-haven-green mr-2" />
            <span className="text-sm">{experience.groupSize}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-haven-green mr-2" />
            <span className="text-sm">{experience.location}</span>
          </div>
        </div>
      </div>

      <div className="prose max-w-none">
        <h2 className="text-2xl font-serif font-bold mb-4">About This Experience</h2>
        <p className="text-gray-700 leading-relaxed mb-6">{experience.longDescription}</p>

        <h3 className="text-xl font-serif font-semibold mb-4">What's Included</h3>
        <ul className="space-y-2 mb-6">
          {experience.includes.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-haven-green mr-2">•</span>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-serif font-semibold mb-4">Availability</h3>
        <div className="flex flex-wrap gap-2">
          {experience.availability.map((day, index) => (
            <Badge key={index} variant="outline" className="border-haven-green text-haven-green">
              {day}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;
