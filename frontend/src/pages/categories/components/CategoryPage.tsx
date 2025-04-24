import React from "react";
import { PageHeader } from "/@/components/common/ui/PageHeader.tsx";
import { Breadcrumbs } from "/@/components/common/ui/Breadcrumbs.tsx";
import { Page } from "/@/components/common/Page.tsx";
import { motion } from "framer-motion";
import { useStoreWithInitializer } from "/@/store/store.hook.ts";
import {
  CategoryState,
  setCategories,
  startLoading,
} from "/@/pages/categories/Category.slice";
import { Category } from "/@/types/category.ts";
import { store } from "/@/store";
import CategoryGrid from "/@/pages/categories/components/category-view/CategoryView.tsx";

export function CategoryPage() {
  const { loading, categories, selectedCategory } =
    useStoreWithInitializer<CategoryState>(({ category }) => category, load);

  return (
    <Page
      headerLess
      title={
        selectedCategory
          ? `Edit Category ${selectedCategory.label}`
          : "Add Category"
      }
    >
      <PageHeader
        title={
          selectedCategory
            ? `Edit Category ${selectedCategory.label}`
            : "Add Category"
        }
        actions={null}
      />
      <Breadcrumbs
        items={[
          { title: "Home", path: "/dashboard" },
          { title: "Category", path: "/category" },
          {
            title: selectedCategory
              ? `Edit Category ${selectedCategory.label}`
              : "Add Category",
          },
        ]}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <p className="text-gray-500 mt-2">Loading...</p>
        ) : (
          <>
            <div
              className={`grid grid-cols-${categories.length} gap-4 p-6 bg-gray-50`}
            >
              <CategoryGrid categories={categories} />
            </div>
          </>
        )}
      </motion.div>
    </Page>
  );
}

async function load() {
  store.dispatch(startLoading());
  setTimeout(() => {
    store.dispatch(setCategories(generateNestedCategories()));
  }, 500);
}

function generateNestedCategories(
  level: number = 1,
  parentCode: string | null = null,
  maxDepth: number = 5,
): Category[] {
  if (level > maxDepth) return [];

  const categories: Category[] = [];

  for (let i = 1; i <= 5; i++) {
    const code = parentCode ? `${parentCode}.${i}` : `L${level}-${i}`;
    const category: Category = {
      code,
      label: `Category ${code}`,
      description: `Description for ${code}`,
      level,
      parentCategoryCode: parentCode ?? undefined,
    };

    category.children = generateNestedCategories(level + 1, code, maxDepth);
    categories.push(category);
  }

  return categories;
}

CategoryPage.displayName = "CategoryPage";
