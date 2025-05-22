
interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) => {
  return (
    <div className="mb-6 border-b border-gray-200">
      <div className="flex overflow-x-auto scrollbar-hide space-x-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`py-3 px-4 font-medium whitespace-nowrap transition-colors ${
              activeCategory === category
                ? 'text-haven-teal border-b-2 border-haven-teal'
                : 'text-gray-600 hover:text-haven-teal'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
