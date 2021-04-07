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
      <Content isScrollable={store.libraryAlbums.length > 5}>
        {store.libraryAlbums.length > 0 ? (
          <div>
            {store.libraryAlbums.map((album) => (
              <Cover key={album.id} {...album} />
            ))}
          </div>
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
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;

  div {
    align-self: center;
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
  }
`;

const Content = styled.div<{ isScrollable: boolean }>`
  padding: 17px ${(props) => (props.isScrollable ? 3 : 17)}px 17px 17px;
  display: grid;
  min-height: 100%;
  grid-template-rows: 1fr 50px;
`;
