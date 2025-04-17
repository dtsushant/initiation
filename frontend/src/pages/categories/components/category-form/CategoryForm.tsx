import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Category, CategorySelectTree } from "/@/types/category.ts";
import { Form } from "antd";
import { store } from "/@/store";
import { GenericForm } from "/@/components/GenericForm/GenericForm.tsx";
import { useStoreWithInitializer } from "/@/store/store.hook.ts";
import categoryForm, {
  CategoryFormField,
  CategoryFormFields,
  CategoryFormState,
  CategoryFormValue,
  isAutoGenerateCode,
  resetForm,
  selectedCategory,
} from "/@/pages/categories/components/category-form/CategoryForm.slice.ts";
import { CategoryFormConfig } from "/@/pages/categories/components/category-form/config/CategoryFormConfig.ts";

export const CategoryForm: React.FC<{
  category: Category | undefined;
  allCategory: Category[];
}> = ({ category, allCategory }) => {
  const {
    form: categoryFormValue,
    autoGenerateCode,
    submitting,
    error,
  } = useStoreWithInitializer<CategoryFormState>(
    ({ categoryForm }) => categoryForm,
    load,
  );
  const [form] = Form.useForm();

  useEffect(() => {
    if (autoGenerateCode) {
      form.resetFields();
      store.dispatch(resetForm());
    }
  }, [category]);

  async function load() {
    store.dispatch(selectedCategory(category));
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {category && (
        <div>
          <h2 className="text-xl font-bold">
            {category.label || category.code}
          </h2>
          <p>
            <strong>Code:</strong> {category.code}
          </p>

          <p>
            <strong>Level:</strong> {category.level}
          </p>
        </div>
      )}
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <GenericForm
          fields={CategoryFormConfig({
            categorySelectTree: buildCategorySelectTree(allCategory),
            autoGenerateCode: autoGenerateCode,
            isAutoGenerate: (name, value) => {
              store.dispatch(isAutoGenerateCode(value));
            },
            selectedCategory: category,
          })}
        />
      </Form>
    </motion.div>
  );
};

const buildCategorySelectTree = (
  allCategory: Category[],
): CategorySelectTree[] => {
  return allCategory.map((cat) => ({
    title: cat.label ?? cat.code,
    value: cat.code,
    children: cat.children ? buildCategorySelectTree(cat.children!) : undefined,
  }));
};

const handleValuesChange = (
  changedValues: Partial<CategoryFormField>,
  allValues: CategoryFormField,
) => {
  console.log("Changed:", changedValues);
  console.log("All values:", allValues);
};

CategoryForm.displayName = "CategoryForm";
