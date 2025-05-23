
import React, { useState, useMemo } from 'react';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface GallerySearchAndFilterProps {
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: GalleryFilters) => void;
  onSortChange: (sort: GallerySortOption) => void;
  searchQuery: string;
  activeFilters: GalleryFilters;
  currentSort: GallerySortOption;
  totalResults: number;
  className?: string;
}

export interface GalleryFilters {
  categories: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface GallerySortOption {
  field: 'name' | 'date' | 'category';
  direction: 'asc' | 'desc';
}

const CATEGORIES = [
  'Exterior Views',
  'Interior Spaces',
  'Amenities',
  'Surrounding Area',
  'Activities',
  'Dining',
  'Events'
];

export const GallerySearchAndFilter: React.FC<GallerySearchAndFilterProps> = ({
  onSearchChange,
  onFilterChange,
  onSortChange,
  searchQuery,
  activeFilters,
  currentSort,
  totalResults,
  className
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter(c => c !== category)
      : [...activeFilters.categories, category];
    
    onFilterChange({
      ...activeFilters,
      categories: newCategories
    });
  };

  const clearAllFilters = () => {
    onFilterChange({ categories: [] });
    onSearchChange('');
  };

  const activeFilterCount = useMemo(() => {
    return activeFilters.categories.length + (searchQuery ? 1 : 0);
  }, [activeFilters, searchQuery]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search gallery..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => onSearchChange('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Button */}
        <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CATEGORIES.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className="flex items-center justify-between"
              >
                <span>{category}</span>
                {activeFilters.categories.includes(category) && (
                  <Badge variant="secondary" className="h-4 px-1 text-xs">✓</Badge>
                )}
              </DropdownMenuItem>
            ))}
            {activeFilterCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear all filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {currentSort.direction === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onSortChange({ field: 'name', direction: 'asc' })}
            >
              Name (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange({ field: 'name', direction: 'desc' })}
            >
              Name (Z-A)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange({ field: 'date', direction: 'desc' })}
            >
              Newest first
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange({ field: 'date', direction: 'asc' })}
            >
              Oldest first
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange({ field: 'category', direction: 'asc' })}
            >
              Category (A-Z)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters Display */}
      {(activeFilters.categories.length > 0 || searchQuery) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchQuery && (
            <Badge variant="outline" className="gap-1">
              Search: "{searchQuery}"
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onSearchChange('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {activeFilters.categories.map((category) => (
            <Badge key={category} variant="outline" className="gap-1">
              {category}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleCategoryToggle(category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {activeFilterCount > 1 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {totalResults} {totalResults === 1 ? 'image' : 'images'} found
      </div>
    </div>
  );
};
