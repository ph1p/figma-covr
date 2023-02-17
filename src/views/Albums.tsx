import { observer } from 'mobx-react';
import { useEffect } from 'preact/hooks';
import React, { FunctionComponent, useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import styled from 'styled-components';

import ContentLoader, { Loader } from '../components/ContentLoader';
import { Cover } from '../components/Cover';
import { EmptyView } from '../components/EmptyView';
import { Layout } from '../components/Layout';
import { useStore } from '../store';
import { Content, Grid } from '../style';

export const AlbumsView: FunctionComponent = observer(() => {
  const store = useStore();

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery('library', (ctx) => store.api.getLibraryAlbums(ctx), {
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

  return isLoading ? (
    <Content>
      <ContentLoader />
    </Content>
  ) : (
    <Layout>
      <Content onScroll={handleScroll}>
        <Grid>
          {data?.pages?.map((group, i) => (
            <React.Fragment key={i}>
              {group.items.map((album) => (
                <Cover grid key={album.id} {...album} />
              ))}
            </React.Fragment>
          ))}
          {hasNextPage &&
          (isFetchingNextPage || (isFetching && !isFetchingNextPage))
            ? [...new Array(15)].map(() => <Loader />)
            : null}
        </Grid>

        {!isLoading && !data?.pages?.length && (
          <EmptyView
            title="Nothing here"
            description={
              <>
                Add some albums
                <br />
                to your library
              </>
            }
          />
        )}

        <div></div>
      </Content>
    </Layout>
  );
});
