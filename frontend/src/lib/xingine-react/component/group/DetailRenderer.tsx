import { Card } from "antd";

import { DetailMeta } from "@xingine/core/component/component-meta-map.ts";
import React, { useState } from "react";
import { renderDetailFields } from "/@/lib/xingine-react/component/group/detail/DetailGroup.tsx";
import { get } from "/@/services/initiation.service.ts";
import { dynamicShapeDecoder } from "@xingine";

export const DetailRenderer: React.FC<DetailMeta> = (meta) => {
  const [detailValue, setDetailValue] = useState<unknown>("");

  const fetchDetail = async () => {
    try {
      /*const url = query
          ? `${fetchAction}?${searchField}=${encodeURIComponent(query)}`
          : fetchAction;*/
      const url = "";

      const result = await get<unknown>(dynamicShapeDecoder, url);

      setDetailValue(result);
    } catch (error) {
      console.error("Failed to fetch options:", error);
      setDetailValue("");
    }
  };
  return <Card style={{ margin: 24 }}>{renderDetailFields(meta.fields)}</Card>;
};

export default DetailRenderer;
