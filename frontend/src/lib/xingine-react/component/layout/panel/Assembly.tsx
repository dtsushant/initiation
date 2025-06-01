import { Breadcrumb, Tabs } from "antd";
import { useLocation } from "react-router-dom";

const Assembly = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  return (
    <section className="p-4">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        {pathSnippets.map((_, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
          return <Breadcrumb.Item key={url}>{_}</Breadcrumb.Item>;
        })}
      </Breadcrumb>
      <Tabs
        defaultActiveKey="1"
        type="line"
        items={[
          {
            label: "Overview",
            key: "1",
            children: <div>Overview content</div>,
          },
          {
            label: "Analytics",
            key: "2",
            children: <div>Analytics content</div>,
          },
          {
            label: "Settings",
            key: "3",
            children: <div>Settings content</div>,
          },
        ]}
      />
      <p>
        What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum has been the industry's standard
        dummy text ever since the 1500s, when an unknown printer took a galley
        of type and scrambled it to make a type specimen book. It has survived
        not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged. It was popularised in the 1960s with
        the release of Letraset sheets containing Lorem Ipsum passages, and more
        recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum. Why do we use it? It is a long established fact
        that a reader will be distracted by the readable content of a page when
        looking at its layout. The point of using Lorem Ipsum is that it has a
        more-or-less normal distribution of letters, as opposed to using
        'Content here, content here', making it look like readable English. Many
        desktop publishing packages and web page editors now use Lorem Ipsum as
        their default model text, and a search for 'lorem ipsum' will uncover
        many web sites still in their infancy. Various versions have evolved
        over the years, sometimes by accident, sometimes on purpose (injected
        humour and the like).
      </p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
      <p>This is the default body content.</p>
    </section>
  );
};

export default Assembly;
