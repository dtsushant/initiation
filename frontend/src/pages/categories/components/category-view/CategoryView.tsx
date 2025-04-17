import React, { useEffect } from "react";
import { Category } from "/@/types/category.ts";
import { useStore } from "/@/store/store.hook.ts";
import {
  CategoryState,
  selectCategory,
  setExpanded,
} from "/@/pages/categories/Category.slice.ts";
import { store } from "/@/store";
import { CategoryForm } from "/@/pages/categories/components/category-form/CategoryForm.tsx";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

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
  const { slug } = useParams<{ slug: string }>();

  const navigate = useNavigate();
  useEffect(() => {
    console.log("triggered");
    if (!selectedCategory) {
      const cat = findCategoryByCode(categories, slug);
      store.dispatch(selectCategory(cat));
    }
  }, [slug]);

  const handleSelect = (cat: Category | undefined) => {
    store.dispatch(selectCategory(cat));
    navigate(`/categories/${cat ? cat.code : ""}`);
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
      <div className="px-6 w-4/5 p-6 space-y-6 bg-white rounded-md min-h-full pb-6 py-3">
        <div className="flex justify-end mb-4">
          {selectedCategory ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleSelect(undefined)}
            >
              Add New Category
            </Button>
          ) : (
            <></>
          )}
        </div>

        <CategoryForm category={selectedCategory} allCategory={categories} />
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

function findCategoryByCode(
  categories: Category[],
  code: string | undefined,
): Category | undefined {
  for (const category of categories) {
    if (category.code === code) {
      return category;
    }
    if (category.children) {
      const found = findCategoryByCode(category.children, code);
      if (found) return found;
    }
  }
  return undefined;
}

export default CategoryGrid;
