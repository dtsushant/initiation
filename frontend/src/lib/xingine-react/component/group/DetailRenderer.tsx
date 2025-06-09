import { Card } from "antd";

import React, { useEffect, useState } from "react";
import { renderDetailFields } from "/@/lib/xingine-react/component/group/detail/DetailGroup.tsx";
import { useParams } from "react-router-dom";
import { nestParamsSluggedParams } from "/@/lib/xingine-react/component/utils/Component.utils.ts";
import { get } from "/@/lib/xingine-react/xingine-react.service.ts";
import { DetailMeta } from "xingine/dist/core/component/component-meta-map";
import { dynamicShapeDecoder, resolveDynamicPath } from "xingine";

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
