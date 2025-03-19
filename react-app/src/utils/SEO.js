import React from 'react';

export function Seo({ title }) {
  return (
    <>
      <title>{title}</title>
      <link id="icon" rel="icon" href="/favicon.svg" type="image/svg+xml" />
    </>
  );
}