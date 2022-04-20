import { observer } from 'mobx-react';
import React, { FunctionComponent, useCallback, useMemo, useRef } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import styled from 'styled-components';

import { useStore } from '../store';
import { Content, Grid } from '../style';
import { useDebounce } from '../utils/hooks';

import { ListLoader } from './ContentLoader';
import { Cover } from './Cover';
import { EmptyView } from './EmptyView';
import Tooltip from './Tooltip';
import { CloseIcon } from './icons/CloseIcon';
import { MagnifierIcon } from './icons/MagnifierIcon';

export const Header = observer(() => {
  const store = useStore();
  const profileRef = useRef<any>(null);

  const profilePictureUrl = useMemo(() => {
    if (store.user?.images?.length > 0) {
      return store.user.images[0].url;
    }
    return '';
  }, [store.user]);

  const debouncedSearchTerm = useDebounce<string>(store.searchTerm, 500);

  const {
    data = [],
    isLoading,
    isFetching,
  } = useQuery(
    ['search', debouncedSearchTerm],
    (ctx) => {
      profileRef.current.hide();
      if (!ctx.meta.search) {
        return [];
      }
      return store.api.getSearchAlbums(ctx);
    },
    {
      meta: {
        search: debouncedSearchTerm,
      },
      getNextPageParam: (lastPage) =>
        lastPage.next ? lastPage.limit + lastPage.offset : null,
    }
  );

  return (
    <>
      <HeaderStyle>
        <SearchField>
          <MagnifierIcon width="18" height="18" />
          {debouncedSearchTerm && (
            <div className="clear" onClick={() => store.setSearchTerm('')}>
              <CloseIcon width="12" height="12" />
            </div>
          )}
          <input
            type="text"
            placeholder="Search"
            value={store.searchTerm}
            onChange={(e) => store.setSearchTerm(e.currentTarget.value)}
          />
        </SearchField>
        <Tooltip
          hover
          offset={0}
          ref={profileRef}
          handler={React.forwardRef<HTMLDivElement, unknown>((_, ref) => (
            <ProfilePictureWrapper
              ref={ref}
              className="avatar"
              onClick={() => {
                store.logout();
                profileRef.current.hide();
              }}
            >
              <ProfilePicture url={profilePictureUrl} />
            </ProfilePictureWrapper>
          ))}
        >
          Logout
        </Tooltip>
      </HeaderStyle>

      {debouncedSearchTerm || isFetching || (!isLoading && data.length > 0) ? (
        <SearchResults>
          {isFetching ? [...new Array(15)].map(() => <ListLoader />) : null}
          {!isLoading && data.length > 0 ? (
            data.map((album) => <Cover key={album.id} {...album} />)
          ) : (
            <EmptyView title="Nothing found" />
          )}
        </SearchResults>
      ) : null}
    </>
  );
});

const SearchResults = styled(Content)`
  position: fixed;
  top: 43px;
  left: 0;
  background-color: #fff;
  z-index: 20;
  height: calc(100% - 43px);
  padding: 15px;
  width: 100%;
`;

const ProfilePictureWrapper = styled.div`
  border-left: 1px solid #e5e5e5;
  padding: 9px 10px;
`;

const HeaderStyle = styled.header`
  display: flex;
  width: 100%;
  height: 43px;
  text-align: center;
  justify-content: center;
  align-self: center;
  border-bottom: 1px solid #e5e5e5;
  position: relative;
  z-index: 21;
  h4 {
    margin: 20px 0 5px;
    color: #fff;
    font-size: 18px;
  }
  p {
    margin: 0;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
  }
`;

const SearchField = styled.div`
  width: 100%;
  padding: 0;
  margin: 0;
  position: relative;
  svg {
    position: absolute;
    top: 12px;
    left: 14px;
  }
  input {
    background-color: #fff;
    padding: 14px 15px 14px 40px;
    font-size: 12px;
    border-radius: 70px;
    border: 0;
    outline: none;
    width: 100%;
    font-weight: 500;

    &::placeholder {
      color: #999;
    }
  }
  .clear {
    cursor: pointer;
    position: absolute;
    right: 40px;
    top: 3px;
    path {
      fill: #555;
    }
  }
`;

const ProfilePicture = styled.div.attrs((p) => ({
  className: !p.url ? 'no-picture' : '',
}))`
  width: 25px;
  height: 25px;
  border-radius: 100%;
  display: block;
  background-size: cover;
  background-image: url(${(props) => props.url});
  cursor: pointer;
  &.no-picture {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;
