import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

import { Cover } from '../components/Cover';
import { Layout } from '../components/Layout';
import { useStore } from '../store';

export const LibraryView: FunctionComponent = observer(() => {
  const store = useStore();

  useEffect(() => {
    store.api
      .getLibraryAlbums()
      .then((data) => data && store.setLibraryAlbums(data))
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Layout>
      <Content>
        {store.libraryAlbums.length > 0 ? (
          store.libraryAlbums.map((album) => (
            <Cover key={album.id} {...album} />
          ))
        ) : (
          <EmptyScreen>
            <div>
              <h4>loading...</h4>
              <p>Retrieving the Album Library</p>
            </div>
          </EmptyScreen>
        )}
      </Content>
    </Layout>
  );
});

const EmptyScreen = styled.div`
  height: calc(100vh - 34px);
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;

  div {
    h4 {
      margin: 0 0 5px;
      color: #fff;
      font-size: 18px;
    }
    p {
      margin: 0;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
    }
    align-self: center;
  }
`;

const Content = styled.div`
  padding: 17px;
  padding-bottom: 90px;
`;
