import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import { Cover } from '../components/Cover';
import { Layout } from '../components/Layout';
import { LoadingScreen } from '../components/Loading';
import { LoadingIcon } from '../components/icons/LoadingIcon';
import { useStore } from '../store';

export const LibraryView: FunctionComponent = observer(() => {
  const store = useStore();

  const { isLoading, isError, data = [] } = useQuery('library', () =>
    store.api.getLibraryAlbums()
  );

  useEffect(() => {
    if (isError) {
      store.logout();
      store.setNotification({
        title: 'Session timeout',
        subtitle: 'Please login again',
      });
    }
  }, [isError]);

  return (
    <Layout>
      <Content isScrollable={data.length > 5}>
        {!isLoading ? (
          <div>
            {data.map((album) => (
              <Cover key={album.id} {...album} />
            ))}
          </div>
        ) : (
          <LoadingScreen description="Retrieving the Album Library" />
        )}
      </Content>
    </Layout>
  );
});

const Content = styled.div<{ isScrollable: boolean }>`
  padding: 17px ${(props) => (props.isScrollable ? 3 : 17)}px 17px 17px;
  display: grid;
  min-height: 100%;
  grid-template-rows: 1fr 50px;
`;
