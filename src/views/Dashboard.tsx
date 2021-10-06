import { observer } from 'mobx-react';
import { useEffect } from 'preact/hooks';
import React, { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import { Cover } from '../components/Cover';
import { Layout } from '../components/Layout';
import { LoadingScreen } from '../components/Loading';
import { MagnifierIcon } from '../components/icons/MagnifierIcon';
import { useStore } from '../store';
import { useDebounce } from '../utils/hooks';

export const DashboardView: FunctionComponent = observer(() => {
  const store = useStore();

  const debouncedSearchTerm = useDebounce<string>(store.searchTerm, 500);

  const {
    isLoading,
    isError,
    data = [],
  } = useQuery(['users', debouncedSearchTerm], () =>
    debouncedSearchTerm ? store.api.getAlbums(debouncedSearchTerm) : []
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
      <Content isScrollable={data.length > 4}>
        <Header>
          <SearchField>
            <MagnifierIcon />
            <input
              type="text"
              value={store.searchTerm}
              onChange={(e) => store.setSearchTerm(e.currentTarget.value)}
            />
          </SearchField>
        </Header>
        {isLoading && <LoadingScreen description="Retrieving album covers" />}

        <SearchResults>
          {data.length > 0 &&
            data.map((album) => <Cover grid key={album.id} {...album} />)}

          {!isLoading && !data.length && (
            <EmptyScreen>
              <div>
                <h4>Search artists above</h4>
                <p>
                  Click the covers after selection <br />
                  or simply drag&drop them
                </p>
              </div>
            </EmptyScreen>
          )}
        </SearchResults>
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

const Content = styled.div<{ isScrollable: boolean }>`
  padding: 17px ${(props) => (props.isScrollable ? 3 : 17)}px 17px 17px;
  display: grid;
  min-height: 100%;
  grid-template-rows: 49px 1fr 60px;
`;

const SearchResults = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const Header = styled.div`
  display: flex;
  top: 17px;
  left: 0;
  right: 0;
  z-index: 5;
  position: sticky;
  margin-bottom: 17px;
`;

const SearchField = styled.div`
  width: 100%;
  padding: 0;
  margin: 0;
  svg {
    position: absolute;
    top: 5px;
    left: 8px;
  }
  input {
    background-color: #fff;
    padding: 8px 15px 8px 35px;
    font-size: 15px;
    border-radius: 70px;
    border: 0;
    outline: none;
    width: 100%;
  }
`;
