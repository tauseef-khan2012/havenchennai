
import { Experience } from '@/data/experiencesData';

interface ExperienceDetailsProps {
  experience: Experience;
}

const ExperienceDetails = ({ experience }: ExperienceDetailsProps) => {
  return (
    <div className="md:col-span-2">
      <h2 className="font-serif text-3xl font-bold mb-6">About This Experience</h2>
      <p className="text-gray-700 mb-8">{experience.longDescription}</p>
      
      <h3 className="font-serif text-xl font-semibold mb-4">What's Included</h3>
      <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2 mb-8">
        {experience.includes.map((item, index) => (
          <li key={index} className="flex items-start">
            <svg className="h-5 w-5 text-haven-green mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      
      <h3 className="font-serif text-xl font-semibold mb-4">Available Days</h3>
      <div className="flex flex-wrap gap-2 mb-8">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
          const isAvailable = experience.availability.includes(day);
          return (
            <div 
              key={day}
              className={`px-4 py-2 rounded-md border ${
                isAvailable 
                  ? 'border-haven-green bg-haven-green bg-opacity-10 text-haven-green' 
                  : 'border-gray-200 bg-gray-50 text-gray-400'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
      
      <h3 className="font-serif text-xl font-semibold mb-4">Important Details</h3>
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
        <div>
          <p className="font-medium mb-1">What to Bring</p>
          <p className="text-gray-600">Comfortable clothing, water bottle, and your sense of adventure!</p>
        </div>
        <div>
          <p className="font-medium mb-1">Fitness Level</p>
          <p className="text-gray-600">Suitable for all fitness levels. No prior experience required.</p>
        </div>
        <div>
          <p className="font-medium mb-1">Age Restrictions</p>
          <p className="text-gray-600">This experience is suitable for guests 12 years and older.</p>
        </div>
        <div>
          <p className="font-medium mb-1">Weather Policy</p>
          <p className="text-gray-600">Experiences may be rescheduled in case of severe weather conditions.</p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;
