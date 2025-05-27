
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BlogSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const BlogSearch = ({ searchTerm, onSearchChange }: BlogSearchProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-serif font-bold text-haven-dark mb-4">Search Articles</h3>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-gray-300 focus:border-haven-teal focus:ring-haven-teal"
        />
      </div>
    </div>
  );
};

export default BlogSearch;
