import React from 'react';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';

export const Loader = (props: { rounded?: boolean }) => (
  <ContentLoader
    speed={2}
    width={113}
    height={160}
    viewBox="0 0 120 160"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    {props.rounded ? (
      <circle cx="60" cy="60" r="60" />
    ) : (
      <rect x="0" y="0" rx="5" ry="5" width="120" height="120" />
    )}
    <rect x="0" y="130" width="52" height="15" />
    <rect x="0" y="150" width="88" height="8" />
  </ContentLoader>
);

export const ListLoader = (props: { rounded?: boolean }) => (
  <ContentLoader
    speed={2}
    width={255}
    height={85}
    viewBox="0 0 255 85"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    {props.rounded ? (
      <circle cx="35" cy="35" r="35" />
    ) : (
      <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
    )}
    <rect x="80" y="20" width="52" height="15" />
    <rect x="80" y="45" width="88" height="8" />
  </ContentLoader>
);

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

export default (props: { rounded?: boolean }) => (
  <Grid>
    {[...new Array(6)].map(() => (
      <Loader rounded={props.rounded} />
    ))}
  </Grid>
);
