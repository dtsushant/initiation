import {
  buildGenericFormField,
  GenericFormField,
} from "/@/types/genericFormField.tsx";
import { Category, CategorySelectTree } from "/@/types/category.ts";
import { NamePath } from "antd/es/form/interface";
import { getCategory } from "/@/services/category.service.ts";

type CategoryFormProps = {
  autoGenerateCode: boolean;
  categorySelectTree: CategorySelectTree[];
  isAutoGenerate: (name: NamePath, value: boolean) => void;
  selectedCategory?: Category;
};

export const CategoryFormConfig = (
  categoryFormProps: CategoryFormProps,
): GenericFormField[] => {
  const fields: GenericFormField[] = [];
  const { selectedCategory } = categoryFormProps;
  if (!selectedCategory) {
    fields.push(
      buildGenericFormField({
        name: "autoGenerateCode" as NamePath,
        label: "Auto Generate",
        fieldType: "switch",
        initialValue: categoryFormProps.autoGenerateCode,
        onChange: categoryFormProps.isAutoGenerate,
      }),
    );
  }

  if (!selectedCategory && !categoryFormProps.autoGenerateCode) {
    fields.push(
      buildGenericFormField({
        name: "code" as NamePath,
        label: "Code",
        fieldType: "input",
        maxLength: 6,
        rules: [
          { required: true, message: "Code is required" },
          { len: 6, message: "Code must be exactly 6 characters" },
          {
            validator: async (_, value) => {
              if (!value) return Promise.resolve();

              if (value.length !== 6) {
                return Promise.resolve();
              }
              const category = await getCategory(value);
              if (category) {
                return Promise.reject(
                  new Error(`Category with code ${value} already exists`),
                );
              }
              return Promise.resolve();
            },
          },
        ],
      }),
    );
  }

  fields.push(
    buildGenericFormField({
      name: "label" as NamePath,
      label: "Category Label",
      fieldType: "input",
      initialValue: selectedCategory?.label,
      rules: [{ required: true, message: "Code is required" }],
    }),
    buildGenericFormField({
      name: "description" as NamePath,
      label: "Description",
      fieldType: "textarea",
      initialValue: selectedCategory?.description,
    }),
    buildGenericFormField({
      name: "parentCategoryCode" as NamePath,
      label: "Parent Category Code",
      fieldType: "treeSelect",
      treeData: categoryFormProps.categorySelectTree,
      initialValue: selectedCategory?.parentCategoryCode,
      treeSelectProps: {
        showSearch: true,
        allowClear: true,
        treeDefaultExpandAll: true,
      },
    }),
  );

  return fields;
};
