import axios from 'axios';
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
import { PlaylistsIcon } from './icons/PlaylistsIcon';
import { PodcastIcon } from './icons/PodcastIcon';

export const FloatingNavigation: FunctionComponent = observer(() => {
  const store = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement & { hide: () => void }>(null);
  const libraryRef = useRef<HTMLDivElement & { hide: () => void }>(null);

  return (
    <>
      <InsertContainer hide={!store.shiftPressed}>
        <InsertButton
          onClick={async () => {
            if(!store.insertItems.length) {
              return;
            }

            let selectionCount = (await FigmaMessageEmitter.ask(
              'selection count'
            )) as number;

            const frameId = await FigmaMessageEmitter.ask(
              'create items frame',
              {
                isDragAndDrop: false,
              }
            );

            let currentCount = 0;

            if (!selectionCount) {
              selectionCount = store.insertItems.length;
            }

            for (const count of [...new Array(selectionCount)].map(
              (_, i) => i
            )) {
              try {
                const response = await axios.get(
                  store.insertItems[currentCount],
                  {
                    responseType: 'arraybuffer',
                  }
                );

                const data = Buffer.from(response.data, 'binary');
                FigmaMessageEmitter.emit('insert item', {
                  data,
                  parentId: frameId,
                  selectionIndex: selectionCount === 0 ? null : count,
                });

                if (store.insertItems[currentCount + 1]) {
                  currentCount++;
                } else {
                  currentCount = 0;
                }
              } catch {
                //
              }
            }
            if(!store.insertItems.length) {
              store.setShiftPressed(false);
            }
          }}
        >
          insert ({store.insertItems.length})
        </InsertButton>
        {store.insertItems.length > 0 && (
          <InsertButton onClick={() => store.setShiftPressed(false)}>
            close
          </InsertButton>
        )}
      </InsertContainer>

      <Wrapper hide={store.shiftPressed}>
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
                    navigate('/playlists');
                    searchRef.current.hide();
                  }}
                  className={location.pathname === '/playlists' ? 'active' : ''}
                >
                  <PlaylistsIcon width="25" height="25" />
                </li>
              ))}
            >
              Playlists
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

export const InsertContainer = styled.div`
  transition: transform 0.3s;
  transform: translateY(${(p) => (p.hide ? 100 : 0)}px);
  display: flex;
  gap: 7px;
  justify-content: center;
  position: absolute;
  left: 0;
  width: 100%;
  bottom: 15px;
  z-index: 30;
`;
export const InsertButton = styled.div`
  padding: 10px 26px;
  border-radius: 20px;
  background-color: #121212;
  box-shadow: 0px 7px 14px rgb(0 0 0 / 57%);
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
      opacity: 0.2;
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
          svg {
            opacity: 1;
          }
        }
      }
    }
  }
`;
