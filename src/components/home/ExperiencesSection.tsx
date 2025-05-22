
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { homeExperiences } from '@/data/homeExperiencesData';
import HomeExperienceCarousel from './HomeExperienceCarousel';
import CategoryTabs from './CategoryTabs';

const ExperiencesSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Wellness', 'Cultural', 'Adventure', 'Couples'];

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-haven-dark mb-2">
              Curated Experiences
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Discover the best of Chennai's East Coast Road with our handpicked experiences, from cultural landmarks to natural wonders.
            </p>
          </div>
          <Link to="/experiences" className="mt-4 md:mt-0 text-haven-teal hover:underline font-medium flex items-center">
            All Experiences <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <CategoryTabs 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />

        <HomeExperienceCarousel 
          experiences={homeExperiences} 
          selectedCategory={activeCategory} 
        />
      </div>
    </section>
  );
};

export default ExperiencesSection;
