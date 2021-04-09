import { observer } from 'mobx-react';
import React, { FunctionComponent, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useStore } from '../store';

import Tooltip from './Tooltip';
import { LibraryIcon } from './icons/LibraryIcon';
import { MagnifierIcon } from './icons/MagnifierIcon';

export const FloatingNavigation: FunctionComponent = observer(() => {
  const store = useStore();
  const history = useHistory();
  const location = useLocation();

  const profilePictureUrl = useMemo(() => {
    if (store.user?.images?.length > 0) {
      return store.user.images[0].url;
    }
    return '';
  }, [store.user]);
  return (
    <Wrapper>
      <nav>
        <ul>
          <Tooltip
            hover
            handler={React.forwardRef<HTMLLIElement, unknown>((_, ref) => (
              <li
                ref={ref}
                onClick={() => history.push('/dashboard')}
                className={location.pathname === '/dashboard' ? 'active' : ''}
              >
                <MagnifierIcon width="25" height="25" />
              </li>
            ))}
          >
            Search
          </Tooltip>
          <Tooltip
            hover
            handler={React.forwardRef<HTMLLIElement, unknown>((_, ref) => (
              <li
                ref={ref}
                onClick={() => history.push('/library')}
                className={location.pathname === '/library' ? 'active' : ''}
              >
                <LibraryIcon width="25" height="25" />
              </li>
            ))}
          >
            Library
          </Tooltip>
          <Tooltip
            hover
            handler={React.forwardRef<HTMLLIElement, unknown>((_, ref) => (
              <li ref={ref} className="avatar" onClick={() => store.logout()}>
                <ProfilePicture url={profilePictureUrl} />
              </li>
            ))}
          >
            Logout
          </Tooltip>
        </ul>
      </nav>
    </Wrapper>
  );
});

const ProfilePicture = styled.div.attrs((p) => ({
  className: !p.url ? 'no-picture' : '',
}))`
  width: 28px;
  height: 28px;
  border-radius: 100%;
  display: block;
  background-size: cover;
  background-image: url(${(props) => props.url});
  &.no-picture {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const Wrapper = styled.div`
  position: fixed;
  z-index: 10;
  bottom: 17px;
  left: 0;
  left: 50%;
  transform: translateX(-50%);
  nav {
    padding: 11px 13px;
    border-radius: 28px;
    background-color: #121212;
    filter: drop-shadow(0px 7px 14px rgba(0, 0, 0, 0.57));
    width: 190px;
    svg {
      path {
        fill: #fff;
      }
    }
    ul {
      justify-content: space-between;
      align-items: center;
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        position: relative;
        cursor: pointer;
        line-height: 0;
        height: 28px;
        &:nth-child(1) {
          margin-left: 5px;
        }
        &.avatar {
          margin: 0;
          &::after {
            display: none;
          }
        }
        &.active,
        &:hover {
          &::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -5px;
            transform: translateX(-50%);
            background-color: #1bc47d;
            border-radius: 5px;
            width: 3px;
            height: 3px;
          }
        }
      }
    }
  }
`;
