import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Category,
  CategoryFormFields,
  CategorySelectTree,
} from "/@/types/category.ts";
import { Button, Form } from "antd";
import { store } from "/@/store";
import { GenericForm } from "/@/components/GenericForm/GenericForm.tsx";
import { useStoreWithInitializer } from "/@/store/store.hook.ts";
import {
  CategoryFormField,
  CategoryFormState,
  isAutoGenerateCode,
  resetForm,
  selectedCategory,
  updateField,
  startSubmitting,
} from "/@/pages/categories/components/category-form/CategoryForm.slice.ts";
import { CategoryFormConfig } from "/@/pages/categories/components/category-form/config/CategoryFormConfig.ts";
import { saveCategory } from "/@/services/category.service.ts";
import { LoginOutlined } from "@ant-design/icons";

export const CategoryForm: React.FC<{
  category: Category | undefined;
  allCategory: Category[];
}> = ({ category, allCategory }) => {
  const { autoGenerateCode, submitting } =
    useStoreWithInitializer<CategoryFormState>(
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
      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        onValuesChange={handleValuesChange}
      >
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
        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 rounded-lg text-base font-medium flex items-center justify-center bg-primary text-white hover:bg-blue-700 transition-all"
            loading={submitting}
            disabled={submitting}
            icon={!submitting && <LoginOutlined className="mr-2" />}
          >
            {submitting ? "Please wait..." : "Submit"}
          </Button>
        </Form.Item>
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

const handleValuesChange = (changedValues: Partial<CategoryFormField>) => {
  for (const [name, value] of Object.entries(changedValues)) {
    store.dispatch(
      updateField({ name: name as keyof CategoryFormFields, value }),
    );
  }
};

async function submit() {
  if (store.getState().categoryForm.submitting) return;
  store.dispatch(startSubmitting());
  console.log(store.getState().categoryForm.form);
  const result = await saveCategory(store.getState().categoryForm.form);
}

CategoryForm.displayName = "CategoryForm";
