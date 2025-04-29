import { Card } from "antd";

export const TableRenderer = ({ children }: { children: React.ReactNode }) => (
  <Card style={{ margin: 24 }}>{children}</Card>
);

export default TableRenderer;
