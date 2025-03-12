
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

type Level = "Beginner" | "Intermediate" | "Advanced";

interface FiltersProps {
  categories: string[];
  onFilterChange: (filters: {
    category?: string;
    level?: Level;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) => void;
}

const CourseFilters: React.FC<FiltersProps> = ({ categories, onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<Level | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    applyFilters({ search: e.target.value });
  };

  const handleCategoryChange = (value?: string) => {
    setCategory(value);
    applyFilters({ category: value });
  };

  const handleLevelChange = (value?: Level) => {
    setLevel(value);
    applyFilters({ level: value });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setPriceRange({ min, max });
    applyFilters({ minPrice: min, maxPrice: max });
  };

  const applyFilters = (newFilters: any) => {
    onFilterChange({
      category: newFilters.category !== undefined ? newFilters.category : category,
      level: newFilters.level !== undefined ? newFilters.level : level,
      minPrice: newFilters.minPrice !== undefined ? newFilters.minPrice : priceRange.min,
      maxPrice: newFilters.maxPrice !== undefined ? newFilters.maxPrice : priceRange.max,
      search: newFilters.search !== undefined ? newFilters.search : search,
    });
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategory(undefined);
    setLevel(undefined);
    setPriceRange({});
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={handleSearchChange}
          className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div className="md:hidden mb-4">
        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-left"
        >
          <div className="flex items-center">
            <Filter size={16} className="mr-2" />
            <span>Filters</span>
          </div>
          <span>{filtersExpanded ? '-' : '+'}</span>
        </button>
      </div>
      
      <div className={`md:block ${filtersExpanded ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category || ''}
              onChange={(e) => handleCategoryChange(e.target.value || undefined)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={level || ''}
              onChange={(e) => handleLevelChange(e.target.value as Level || undefined)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              value={`${priceRange.min || 0}-${priceRange.max || ''}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(v => v ? Number(v) : undefined);
                handlePriceChange(min, max);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="0-">All Prices</option>
              <option value="0-25">Under $25</option>
              <option value="25-50">$25 to $50</option>
              <option value="50-100">$50 to $100</option>
              <option value="100-">Over $100</option>
            </select>
          </div>
        </div>
        
        {(search || category || level || priceRange.min || priceRange.max) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearAllFilters}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600"
            >
              <X size={14} className="mr-1" />
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseFilters;
