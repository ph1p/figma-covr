import axios from 'axios';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useRef } from 'preact/hooks';
import React, { FunctionComponent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useStore } from '../store';
import FigmaMessageEmitter from '../utils/MessageEmitter';

import Tooltip from './Tooltip';
import { ArtistIcon } from './icons/ArtistIcon';
import { LibraryIcon } from './icons/LibraryIcon';
import { MusicIcon } from './icons/MusicIcon';
import { PodcastIcon } from './icons/PodcastIcon';

export const FloatingNavigation: FunctionComponent = observer(() => {
  const store = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<any>(null);
  const libraryRef = useRef<any>(null);

  return (
    <>
      <InsertButton
        hide={!store.metaPressed}
        onClick={async () => {
          const frameId = await FigmaMessageEmitter.ask('create items frame');

          for (const item of store.insertItems) {
            axios
              .get(item, {
                responseType: 'arraybuffer',
              })
              .then((response) => {
                const data = Buffer.from(response.data, 'binary');
                FigmaMessageEmitter.emit('insert item', {
                  data,
                  parentId: frameId,
                });
              });
          }
        }}
      >
        insert ({store.insertItems.length})
      </InsertButton>
      <Wrapper hide={store.metaPressed}>
        <nav>
          <ul>
            <Tooltip
              hover
              offset={19}
              ref={searchRef}
              handler={React.forwardRef<HTMLLIElement, unknown>((_, ref) => (
                <li
                  ref={ref}
                  onClick={() => {
                    navigate('/dashboard');
                    searchRef.current.hide();
                  }}
                  className={location.pathname === '/dashboard' ? 'active' : ''}
                >
                  <PodcastIcon width="25" height="25" />
                </li>
              ))}
            >
              Podcasts
            </Tooltip>
            <Tooltip
              hover
              offset={19}
              ref={libraryRef}
              handler={React.forwardRef<HTMLLIElement, unknown>((_, ref) => (
                <li
                  ref={ref}
                  onClick={() => {
                    navigate('/albums');
                    libraryRef.current.hide();
                  }}
                  className={location.pathname === '/albums' ? 'active' : ''}
                >
                  <LibraryIcon width="25" height="25" />
                </li>
              ))}
            >
              Albums
            </Tooltip>
            <Tooltip
              hover
              offset={19}
              ref={searchRef}
              handler={React.forwardRef<HTMLLIElement, unknown>((_, ref) => (
                <li
                  ref={ref}
                  onClick={() => {
                    navigate('/tracks');
                    searchRef.current.hide();
                  }}
                  className={location.pathname === '/tracks' ? 'active' : ''}
                >
                  <MusicIcon width="25" height="25" />
                </li>
              ))}
            >
              Tracks
            </Tooltip>
            <Tooltip
              hover
              offset={19}
              ref={searchRef}
              handler={React.forwardRef<HTMLLIElement, unknown>((_, ref) => (
                <li
                  ref={ref}
                  onClick={() => {
                    navigate('/artists');
                    searchRef.current.hide();
                  }}
                  className={location.pathname === '/artists' ? 'active' : ''}
                >
                  <ArtistIcon
                    width="25"
                    height="25"
                    style={{ margin: '-2px 0 0 0' }}
                  />
                </li>
              ))}
            >
              Artists
            </Tooltip>
          </ul>
        </nav>
      </Wrapper>
    </>
  );
});

export const InsertButton = styled.div`
  position: absolute;
  left: 50%;
  bottom: 15px;
  transition: transform 0.3s;
  transform: translateX(-50%) translateY(${(p) => (p.hide ? 100 : 0)}px);
  padding: 10px 36px;
  border-radius: 20px;
  background-color: #121212;
  box-shadow: 0px 7px 14px rgb(0 0 0 / 57%);
  z-index: 30;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
`;

const Wrapper = styled.div<{ hide: boolean }>`
  position: fixed;
  z-index: 10;
  bottom: 7px;
  left: 0;
  left: 50%;
  transition: transform 0.3s;
  transform: translateX(-50%) translateY(${(p) => (p.hide ? 70 : 0)}px);
  nav {
    padding: 11px 13px;
    border-radius: 6px;
    background-color: #121212;
    box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.57);
    width: 271px;
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
          svg g {
            opacity: 1;
          }
        }
      }
    }
  }
`;
