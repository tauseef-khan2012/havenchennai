
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ExperienceHero from '@/components/experiences/ExperienceHero';
import ExperienceFilter from '@/components/experiences/ExperienceFilter';
import ExperiencesList from '@/components/experiences/ExperiencesList';
import ExperiencePhilosophy from '@/components/experiences/ExperiencePhilosophy';
import { experiencesData } from '@/data/experiencesData';

const Experiences = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Get unique categories for filter
  const categories = ['All', ...new Set(experiencesData.map(exp => exp.category))];
  
  // Filter experiences based on search and category
  const filteredExperiences = experiencesData.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         experience.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || experience.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <>
      <Navbar />
      <main>
        <ExperienceHero 
          title="Curated Experiences" 
          subtitle="Discover authentic cultural, wellness, and adventure activities around Chennai's East Coast Road, carefully selected to enhance your stay at Haven."
          backgroundImage="/lovable-uploads/dca2b7eb-af54-4c6e-8739-8add4f661dba.png"
        />
        
        <ExperienceFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        <ExperiencesList 
          experiences={filteredExperiences}
          clearFilters={clearFilters}
        />
        
        <ExperiencePhilosophy />
      </main>
      <Footer />
    </>
  );
};

export default Experiences;
