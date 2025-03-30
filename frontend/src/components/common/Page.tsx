import { Skeleton, Spin } from 'antd';
import React, { memo } from 'react';
import {  Title, Meta } from 'react-head';
import { PageHeader } from './ui/PageHeader';

const Page = memo<PageProps>((props) => {
  const { title, header, children, loading, headerLess } = props;

  const documentTitle = loading ? (
    <Spin size="small" />
  ) : typeof title === 'string' ? (
    `Deals - ${title}`
  ) : typeof title === 'number' || typeof title === 'boolean' ? (
    String(title)
  ) : (
    'Deals - Never Pay Full Price Again'
  );

  return (
    <>
      {documentTitle && (
        <>
        <Title>{documentTitle}</Title>
        <Meta name="description" content="Awesome page" />
      </>
      )}

      {headerLess ? null : React.isValidElement(header) ? (
        header
      ) : (
        <PageHeader
          title={loading ? 'Loading...' : (title?.toString() ?? 'Deals')}
        />
      )}

      <Skeleton active={loading} loading={loading}>
        {children}
      </Skeleton>
    </>
  );
});
Page.displayName = 'Page';

export { Page };
