import { observer } from 'mobx-react';
import { useEffect } from 'preact/hooks';
import React, { FunctionComponent, useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ContentLoader, { ListLoader } from '../components/ContentLoader';
import { EmptyView } from '../components/EmptyView';
import { Layout } from '../components/Layout';
import { useStore } from '../store';
import { Content, Grid } from '../style';

export const PlaylistsView: FunctionComponent = observer(() => {
  const store = useStore();
  const navigate = useNavigate();

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery('playlists', (ctx) => store.api.getPlaylists(ctx), {
    getNextPageParam: (lastPage) =>
      lastPage.next ? lastPage.limit + lastPage.offset : null,
  });

  const handleScroll = useCallback(
    (e) => {
      const element = e.target;
      if (
        element.scrollHeight - element.clientHeight / 3 - element.scrollTop <=
        element.clientHeight
      ) {
        if (hasNextPage && !isFetchingNextPage && !isFetching) {
          fetchNextPage();
        }
      }
    },
    [hasNextPage, isFetchingNextPage, isFetching, fetchNextPage]
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

  useEffect(() => {
    store.setShiftEnabled(false);
    return () => store.setShiftEnabled(true);
  }, []);

  const navigateToPlaylist = ({ name, id }) => {
    store.setHeader({
      title: name,
      backLink: '/playlists',
    });

    navigate(`/playlists/${id}`);
  };

  return isLoading ? (
    <Content>
      {[...new Array(8)].map(() => (<ListLoader />))}
    </Content>
  ) : (
    <Layout>
      <Content onScroll={handleScroll}>
        <Grid>
          {data?.pages?.map((group, i) => (
            <List key={i}>
              {group.items.map((playlist) => (
                <ListItem
                  key={playlist.id}
                  onClick={() => navigateToPlaylist(playlist)}
                >
                  <div
                    className="image"
                    style={{
                      backgroundImage: `url(${playlist.images[0].url})`,
                    }}
                  />
                  <div>
                    <h4>{playlist.name}</h4>
                    <div className="open">OPEN -&gt;</div>
                  </div>
                </ListItem>
              ))}
            </List>
          ))}
          {hasNextPage &&
          (isFetchingNextPage || (isFetching && !isFetchingNextPage))
            ? [...new Array(15)].map(() => <ListLoader />)
            : null}
        </Grid>

        {!isLoading && !data?.pages?.length && (
          <EmptyView
            title="Nothing here"
            description="Just create some playlists"
          />
        )}

        <div></div>
      </Content>
    </Layout>
  );
});

const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  width: 100%;
  & > * + * {
    margin-top: 1em;
  }
`;

const ListItem = styled.li`
  display: grid;
  align-items: center;
  grid-template-columns: 70px calc(100% - 85px);
  gap: 20px;
  cursor: pointer;
  .image {
    border-radius: 8px;
    display: block;
    transition: all 0.3s;
    width: 70px;
    height: 70px;
    background-size: cover;
    box-shadow: 7px 0 0px -3px #bbb, 13px 0 0px -5px #ebebeb;
    /* &::after,
    &::before {
      content: '';
      position: absolute;
    }
    &::after {
      width: 50px;
      height: 50px;
      background-color: #bbbbbb;
    }
    &::after {
      width: 30px;
      height: 30px;
      background-color: #ebebeb;
    } */
  }
  h4 {
    font-size: 1.35em;
    font-weight: bold;
    margin: 0 0 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  p {
    margin: 0;
    font-size: 11px;
    color: rgba(0, 0, 0, 0.7);
    cursor: pointer;
  }
  .open {
    padding: 3px 5px 2px;
    margin-top: 2px;
    gap: 8px;
    background: #000000;
    border-radius: 5px;
    color: #fff;
    display: inline-block;
  }
  &:hover {
    .image {
      box-shadow: 9px 0 0px -3px #bbb, 17px 0 0px -5px #ebebeb;
    }
  }
`;
