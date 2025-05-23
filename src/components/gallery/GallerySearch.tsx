
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, SortAsc, SortDesc } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  section: 'interiors' | 'lakeside' | 'highlights';
  width: number;
  height: number;
}

interface GallerySearchProps {
  images: GalleryImage[];
  onFilteredImagesChange: (images: GalleryImage[]) => void;
  activeSection: 'all' | 'interiors' | 'lakeside' | 'highlights';
  onSectionChange: (section: 'all' | 'interiors' | 'lakeside' | 'highlights') => void;
}

type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

const GallerySearch: React.FC<GallerySearchProps> = ({
  images,
  onFilteredImagesChange,
  activeSection,
  onSectionChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const sectionLabels = {
    all: 'All Photos',
    interiors: 'Container Interiors',
    lakeside: 'Lakeside & Deck Life',
    highlights: 'ECR & Chennai Highlights'
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        // Add to search history
        setSearchHistory(prev => {
          const newHistory = [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, 5);
          return newHistory;
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort images
  const filteredAndSortedImages = useMemo(() => {
    let filtered = images;

    // Filter by section
    if (activeSection !== 'all') {
      filtered = filtered.filter(img => img.section === activeSection);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(img => 
        img.alt.toLowerCase().includes(query) ||
        img.section.toLowerCase().includes(query)
      );
    }

    // Sort images
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        case 'oldest':
          return parseInt(a.id) - parseInt(b.id);
        case 'name-asc':
          return a.alt.localeCompare(b.alt);
        case 'name-desc':
          return b.alt.localeCompare(a.alt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [images, activeSection, searchQuery, sortBy]);

  // Update filtered images when they change
  useEffect(() => {
    onFilteredImagesChange(filteredAndSortedImages);
  }, [filteredAndSortedImages, onFilteredImagesChange]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const selectSearchSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      case 'name-asc': return 'Name A-Z';
      case 'name-desc': return 'Name Z-A';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search images by description or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {searchHistory.length > 0 && searchQuery === '' && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Recent searches:</span>
          {searchHistory.map((suggestion, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => selectSearchSuggestion(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(sectionLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={activeSection === key ? "default" : "outline"}
              size="sm"
              className={activeSection === key ? "bg-haven-teal" : ""}
              onClick={() => onSectionChange(key as any)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              {sortBy.includes('asc') ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              Sort: {getSortLabel(sortBy)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('newest')}>
              <SortDesc className="mr-2 h-4 w-4" />
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('oldest')}>
              <SortAsc className="mr-2 h-4 w-4" />
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy('name-asc')}>
              <SortAsc className="mr-2 h-4 w-4" />
              Name A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('name-desc')}>
              <SortDesc className="mr-2 h-4 w-4" />
              Name Z-A
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters Display */}
      <div className="flex items-center gap-2 flex-wrap">
        {activeSection !== 'all' && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {sectionLabels[activeSection]}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onSectionChange('all')}
            />
          </Badge>
        )}
        {searchQuery && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: "{searchQuery}"
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={clearSearch}
            />
          </Badge>
        )}
        {(activeSection !== 'all' || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSectionChange('all');
              clearSearch();
            }}
            className="text-xs"
          >
            Clear all filters
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {filteredAndSortedImages.length} of {images.length} images
      </div>
    </div>
  );
};

export default GallerySearch;
