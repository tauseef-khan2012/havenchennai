
import React from 'react';
import { Button } from '@/components/ui/button';

interface BlogCategoriesProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const BlogCategories = ({ categories, selectedCategory, onCategoryChange }: BlogCategoriesProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-serif font-bold text-haven-dark mb-4">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "ghost"}
            className={`w-full justify-start capitalize ${
              selectedCategory === category 
                ? "bg-haven-teal hover:bg-haven-teal/90" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category === 'all' ? 'All Articles' : category.replace('-', ' ')}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BlogCategories;
