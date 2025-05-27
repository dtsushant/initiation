import { Card } from "antd";

import { DetailMeta } from "@xingine/core/component/component-meta-map.ts";
import React, { useEffect, useState } from "react";
import { renderDetailFields } from "/@/lib/xingine-react/component/group/detail/DetailGroup.tsx";
import { get } from "/@/services/initiation.service.ts";
import { dynamicShapeDecoder } from "@xingine";
import { useParams } from "react-router-dom";
import { resolveDynamicPath } from "@xingine/core/utils/type.ts";
import { nestParamsSluggedParams } from "/@/lib/xingine-react/component/utils/Component.utils.ts";

export const DetailRenderer: React.FC<DetailMeta> = (meta) => {
  const [detailValue, setDetailValue] = useState<unknown>({});
  const slug = useParams();
  // const nestedSlug = nestParamsSluggedParams(slug);

  const fetchDetail = async (): unknown => {
    try {
      const url = resolveDynamicPath(meta.action, slug);
      const res = await get<unknown>(dynamicShapeDecoder, url);
      setDetailValue(res);
    } catch (error) {
      console.error("Failed to fetch options:", error);
      return "";
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <Card style={{ margin: 24 }}>
      {renderDetailFields(meta.fields, detailValue)}
    </Card>
  );
};

export default DetailRenderer;
