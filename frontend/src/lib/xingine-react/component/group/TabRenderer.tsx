import { Card } from "antd";

const TabRenderer = ({ children }: { children: React.ReactNode }) => (
  <Card style={{ margin: 24 }}>{children}</Card>
);

export default TabRenderer;
