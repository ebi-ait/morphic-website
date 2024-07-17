import React from 'react';

export const generateHeadElements = (title) => {
  return (
    <>
      <title>{title}</title>
      <link id="icon" rel="icon" href="favicon.svg" />
    </>
  );
};
