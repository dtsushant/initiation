import React, { memo } from "react";
import { motion } from "framer-motion";
import { Page } from "/@/components/common/Page";
import { Breadcrumbs } from "/@/components/common/ui/Breadcrumbs";
import { PageHeader } from "/@/components/common/ui/PageHeader";
import CustomFormBuilder from "./form/FormBuilder.tsx";

export const AddCategoryPage = memo(() => {
  return (
    <Page headerLess title="Add Category">
      <PageHeader title="Add Category" actions={null} />
      <Breadcrumbs
        items={[
          { title: "Home", path: "/dashboard" },
          { title: "Categories", path: "/categories" },
          { title: "Add Category" },
        ]}
      />
      <div className="px-6 space-y-6 bg-white rounded-md min-h-full pb-6 py-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CustomFormBuilder />
        </motion.div>
      </div>
    </Page>
  );
});

AddCategoryPage.displayName = "AddCategoryPage";
