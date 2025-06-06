import React, { useState } from "react";
import { Row, Col } from "antd";
import { ComponentPaletteMap } from "./palette/ComponentPalette.map.tsx";
import { LayoutCanvas } from "./canvas/LayoutCanvas";
import { MetadataEditor } from "./editor/MetadataEditor";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export const LayoutBuilder: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editorVisible, setEditorVisible] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setEditorVisible(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Row gutter={16}>
        <Col span={6}>
          <ComponentPaletteMap />
        </Col>
        <Col span={18}>
          <LayoutCanvas onSelect={handleSelect} />
        </Col>
      </Row>
      <MetadataEditor
        visible={editorVisible}
        selectedId={selectedId}
        onClose={() => setEditorVisible(false)}
      />
    </DndProvider>
  );
};
