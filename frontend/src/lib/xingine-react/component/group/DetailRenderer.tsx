import { Card } from "antd";

import { DetailMeta } from "@xingine/core/component/component-meta-map.ts";
import React from "react";
import { renderDetailFields } from "/@/lib/xingine-react/component/group/detail/DetailGroup.tsx";

export const DetailRenderer = ({ meta }: { meta: DetailMeta }) => {
  return <Card style={{ margin: 24 }}>{renderDetailFields(meta.fields)}</Card>;
};

export default DetailRenderer;
