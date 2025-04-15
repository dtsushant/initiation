import React from "react";
import { Category } from "/@/types/category.ts";
import { useStore } from "/@/store/store.hook.ts";
import {
  CategoryState,
  selectCategory,
  setExpanded,
} from "/@/pages/categories/Category.slice.ts";
import { store } from "/@/store";

interface CategoryGridProps {
  categories: Category[];
  depth?: number;
}

interface CategoryTreeProps {
  categories: Category[];
  onSelect: (cat: Category) => void;
  expanded: Record<string, boolean>;
}

/*const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, depth = 0 }) => {
    // max depth we support — adjust if needed
    const maxDepth = 5;

    // calculate width class based on depth
    const widthClasses = [
        'w-full',
        'w-11/12',
        'w-10/12',
        'w-9/12',
        'w-8/12',
        'w-7/12',
    ];

    const bgColors = [
        'bg-white',
        'bg-blue-50',
        'bg-green-50',
        'bg-yellow-50',
        'bg-pink-50',
        'bg-purple-50',
    ];

    return (
        <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
                <div
                    key={category.code}
                    className={`${widthClasses[depth] || 'w-full'} ${bgColors[depth] || 'bg-white'} p-4 rounded-lg shadow-md border`}
                >
                    <div className="font-bold text-lg text-gray-800">{category.label ?? category.code}</div>
                    <div className="text-sm text-gray-500">Level {category.level}</div>
                    {category.parentCategoryCode && (
                        <div className="text-xs italic text-gray-400">Parent: {category.parentCategoryCode}</div>
                    )}

                    {category.children && category.children.length > 0 && (
                        <div className="mt-4">
                            <CategoryGrid categories={category.children} depth={depth + 1} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};*/

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  depth = 0,
}) => {
  const {
    category: { expanded, selectedCategory },
  } = useStore<{
    category: CategoryState;
  }>((state) => ({
    category: state.category,
  }));

  const handleSelect = (code: Category) => {
    store.dispatch(selectCategory(code));
  };

  return (
    <div className="flex h-screen">
      {/* Tree section (20%) */}
      <div className="w-1/5 border-r overflow-y-auto p-4 bg-gray-50">
        <CategoryTree
          categories={categories}
          onSelect={handleSelect}
          expanded={expanded}
        />
      </div>

      {/* Details section (80%) */}
      <div className="w-4/5 p-6">
        {selectedCategory ? (
          <CategoryDetails category={selectedCategory} />
        ) : (
          <p className="text-gray-500">Select a category to see details</p>
        )}
      </div>
    </div>
  );
};

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  onSelect,
  expanded,
}) => {
  const toggle = (code: string) => {
    store.dispatch(setExpanded(code));
  };

  const renderTree = (category: Category, level = 0) => (
    <div key={category.code} className="ml-4">
      <div className="cursor-pointer text-blue-700 hover:underline">
        <div onClick={() => onSelect(category)}>
          {"—".repeat(level)} {category.label || category.code}
        </div>
        {category.children?.length ? (
          <button
            className="ml-2 text-xs text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              toggle(category.code);
            }}
          >
            [{expanded[category.code] ? "-" : "+"}]
          </button>
        ) : null}
      </div>

      {expanded[category.code] &&
        category.children?.map((child) => renderTree(child, level + 1))}
    </div>
  );

  return <div>{categories.map((cat) => renderTree(cat))}</div>;
};

const CategoryDetails: React.FC<{ category: Category }> = ({ category }) => (
  <div>
    <h2 className="text-xl font-bold">{category.label || category.code}</h2>
    <p>
      <strong>Code:</strong> {category.code}
    </p>
    <p>
      <strong>Description:</strong> {category.description || "N/A"}
    </p>
    <p>
      <strong>Level:</strong> {category.level}
    </p>
    <p>
      <strong>Parent:</strong> {category.parentCategoryCode || "None"}
    </p>
  </div>
);

export default CategoryGrid;
