import { Card } from "antd";

import { DetailMeta } from "@xingine/core/component/component-meta-map.ts";
import React from "react";

export const DetailRenderer = ({ meta }: { meta: DetailMeta }) => {
  return <Card style={{ margin: 24 }}>Detail goes here </Card>;
};

export default DetailRenderer;
