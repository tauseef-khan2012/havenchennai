
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
          title="Lakeside Experiences" 
          subtitle="Discover unique activities in and around Haven, our intimate container retreat by Muttukadu Lake."
          backgroundImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
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
