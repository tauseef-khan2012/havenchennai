
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { experiencesData } from '@/data/experiencesData';
import ExperienceDetailHero from '@/components/experiences/ExperienceDetailHero';
import ExperienceDetails from '@/components/experiences/ExperienceDetails';
import BookingCard from '@/components/experiences/BookingCard';
import RelatedExperiences from '@/components/experiences/RelatedExperiences';

const ExperienceDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the experience by ID
  const experience = experiencesData.find(exp => exp.id === id);
  
  if (!experience) {
    return (
      <>
        <Navbar />
        <div className="container-custom py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Experience not found</h2>
          <p className="mb-6">The experience you're looking for doesn't exist or has been removed.</p>
          <Link to="/experiences">
            <Button>Back to All Experiences</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }
  
  // Find related experiences (same category)
  const relatedExperiences = experiencesData
    .filter(exp => exp.category === experience.category && exp.id !== experience.id)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        <ExperienceDetailHero experience={experience} />
        
        <section className="py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-12">
              <ExperienceDetails experience={experience} />
              <BookingCard experience={experience} />
            </div>
          </div>
        </section>
        
        <RelatedExperiences experiences={relatedExperiences} />
      </main>
      <Footer />
    </>
  );
};

export default ExperienceDetail;
