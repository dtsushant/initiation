import React, { memo, useEffect, useState } from "react";
import { Page } from "/@/components/common/Page";
import { Breadcrumbs } from "/@/components/common/ui/Breadcrumbs";
import { StatsCardSection } from "./components/StatsCardSection";
import { useCategoryTableColumns } from "./hooks/useCategoryTableColumns.tsx";
import { MOCK_DATA } from "./mockData";
import { PageHeader } from "/@/components/common/ui/PageHeader";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import { TableShimmer } from "/@/components/common/ui/shimmer/TableShimmer";
import { RecentDealsTable } from "./components/RecentDealsTable.tsx";

export const DashboardPage = memo(() => {
  const columns = useCategoryTableColumns();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Page headerLess title="Dashboard">
      <PageHeader
        title="Dashboard"
        actions={
          <Link to="/deals/add-new-campaign">
            <Button
              type="primary"
              className="bg-primary hover:bg-brightorange-6 hover:border-brightorange-6 mr-4 h-10"
              icon={<PlusCircleOutlined className="text-[1rem]" />}
            ></Button>
          </Link>
        }
      />
      <Breadcrumbs
        items={[{ title: "Home", path: "/dashboard" }, { title: "Dashboard" }]}
      />
      <div className="space-y-6 rounded-md min-h-full">
        <StatsCardSection />
        {loading ? (
          <TableShimmer />
        ) : (
          <RecentDealsTable columns={columns} data={MOCK_DATA} />
        )}
      </div>
    </Page>
  );
});

DashboardPage.displayName = "DashboardPage";
