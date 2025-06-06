import { Card, Collapse, Table } from "antd";
import {
  ColumnMeta,
  FieldMeta,
  FormMeta,
  TableMeta,
} from "@xingine/core/component/component-meta-map.ts";
import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { dynamicShapeListDecoder } from "@xingine";
import FormRenderer from "/@/lib/xingine-react/component/group/FormRenderer.tsx";
import { loadUserIntoApp, userResponseDecoder } from "/@/types/auth.ts";
import {
  SearchCondition,
  SearchQuery,
} from "@xingine/core/expressions/operators.ts";
import { post } from "/@/lib/xingine-react/xingine-react.service.ts";

export const TableRenderer: React.FC<TableMeta> = (meta) => {
  const {
    dataSourceUrl,
    columns,
    rowKey = "id",
    pagination: paginationConfig,
    searchParams,
  } = meta;

  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: paginationConfig?.pageSize || 10,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState({ and: [] } as SearchQuery);

  const fetch = async () => {
    setLoading(true);
    try {
      //  const data = await get<unknown[]>(dynamicShapeListDecoder,dataSourceUrl);
      const result = await post<unknown, unknown[]>(
        searchQuery,
        dynamicShapeListDecoder,
        dataSourceUrl,
      );

      result.match({
        ok: (res) => {
          setData(res);
        },
        err: (e) => {
          setData([]);
        },
      });
      /*setPagination((prev) => ({
                ...prev,
                total: response.total ?? 0,
            }));*/
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [dataSourceUrl, pagination.current, pagination.pageSize]);

  const buildSearchFormMeta = () => {
    const fields: FieldMeta[] = columns
      .filter((col) => col.filterable?.apply)
      .map((col) => {
        const filterColumn = col.filterable;
        return {
          name: col.dataIndex,
          label: col.title ?? "",
          inputType: filterColumn?.inputType ?? "input",
        };
      });
    const searchForm: FormMeta = {
      fields: fields,
      action: "",
    };
    return searchForm;
  };

  const searchFormMeta = buildSearchFormMeta();

  const onSearch = async (values: Record<string, unknown>): Promise<void> => {
    fetch();
  };

  const onSearchFieldChange = (changed: Record<string, unknown>): void => {
    const updatedConditions: SearchCondition[] = [...(searchQuery.and || [])];

    for (const [changedKey, value] of Object.entries(changed)) {
      const col = columns.find(
        (c) => c.dataIndex === changedKey && c.filterable?.apply !== false,
      );

      if (!col?.filterable) continue;

      const field = col.filterable.searchFieldKey || col.dataIndex;
      const operator = col.filterable.operator || "eq";

      // Remove any existing condition for the same field
      const index = updatedConditions.findIndex(
        (c) => "field" in c && c.field === field,
      );
      if (index !== -1) {
        updatedConditions.splice(index, 1);
      }

      // Only push if value is non-null and defined
      if (field && value !== null && value !== undefined && value !== "") {
        updatedConditions.push({
          field,
          operator,
          value,
        });
      }
    }

    setSearchQuery((prev) => ({
      ...prev,
      and: updatedConditions,
    }));
  };
  const metaCombined = {
    ...searchFormMeta,
    onFinish: onSearch,
    onValuesChange: onSearchFieldChange,
  };

  return (
    <div>
      <Collapse>
        <Collapse.Panel header="Filters" key="filters">
          <FormRenderer {...metaCombined} />
        </Collapse.Panel>
      </Collapse>
      <Table
        rowKey={rowKey}
        loading={loading}
        dataSource={data as object[]}
        columns={convertColumnsToAntD(columns)}
      />
    </div>
  );
};

function convertColumnsToAntD<T = unknown>(
  columns: ColumnMeta[],
): ColumnsType<T> {
  return columns.map((col) => ({
    title: col.title,
    dataIndex: col.dataIndex,
    key: col.key ?? col.dataIndex,
    width: col.width,
    sorter: col.sortable,
    // render: col.render as ((value: any, record: T) => React.ReactNode) | undefined,
  }));
}

export default TableRenderer;
