
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ExperienceFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ExperienceFilter = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  searchTerm,
  setSearchTerm
}: ExperienceFilterProps) => {
  return (
    <section className="py-8 bg-haven-beige bg-opacity-20">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-auto flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-haven-green hover:bg-haven-green/90" : ""}
                onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceFilter;
