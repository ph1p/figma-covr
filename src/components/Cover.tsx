import axios from 'axios';
import { observer } from 'mobx-react';
import { useMemo, useRef, useState } from 'preact/hooks';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useStore } from '../store';
import FigmaMessageEmitter from '../utils/MessageEmitter';
import { AlbumItem, FollowingItem, ShowItem } from '../utils/interfaces';

import { ImageHoverIcon } from './icons/ImageHoverIcon';

export const Cover: FunctionComponent<
  (AlbumItem | ShowItem | FollowingItem) & {
    grid?: boolean;
    round?: boolean;
  }
> = observer(
  (
    props: (AlbumItem | ShowItem) & {
      grid?: boolean;
      round?: boolean;
    }
  ) => {
    const imageUrl = props.images[0].url;
    const [isDrag, setIsDrag] = useState<boolean>(false);
    const ref = useRef<HTMLImageElement>(null);
    const store = useStore();

    const artists = useMemo(
      () =>
        Array.isArray(props.artists)
          ? props.artists.map((artist) => artist.name).join(' & ')
          : props.artists,
      [props.artists]
    );

    const shortName = useMemo(() => {
      const maxLength = props.grid ? 10 : 20;
      let name = props.name;

      if (name.length > maxLength) {
        name = name.substring(0, maxLength);
        name += '...';
      }
      return name;
    }, [props.name]);

    const [dragData, setDragData] = useState({
      offsetX: 0,
      offsetY: 0,
      dragUrl: '',
    });

    const onDragStart = (e) => {
      setIsDrag(true);

      e.nativeEvent.dataTransfer.setDragImage(
        ref.current,
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      );
      setDragData({
        dragUrl: e.currentTarget.dataset.url,
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      });
    };

    const onDragEnd = (e) => {
      e.preventDefault();
      e.nativeEvent.preventDefault();
      setIsDrag(false);
      if (e.view.length === 0) return;

      const dropPosition = {
        clientX: e.clientX,
        clientY: e.clientY,
      };

      const message = {
        dropPosition,
        windowSize: {
          width: window.outerWidth,
          height: window.outerHeight,
        },
        offset: {
          x: dragData.offsetX,
          y: dragData.offsetY,
        },
      };

      axios
        .get(dragData.dragUrl, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          const data = Buffer.from(response.data, 'binary');
          FigmaMessageEmitter.emit('drop image', {
            image: data,
            ...message,
          });
        });
    };

    const sendImage = (url) => {
      axios
        .get(url, {
          responseType: 'arraybuffer',
        })
        .then((response) =>
          FigmaMessageEmitter.emit(
            'set image',
            Buffer.from(response.data, 'binary')
          )
        );
    };

    const sendText = (text) => FigmaMessageEmitter.emit('set text', text);
    const dimTile = store.metaPressed && !store.insertItems.includes(imageUrl);

    return (
      <Wrapper
        key={props.id}
        grid={props.grid}
        data-url={imageUrl}
        onClick={() => store.metaPressed && store.addRemoveInsertItem(imageUrl)}
        onDragStart={store.metaPressed ? null : onDragStart}
        onDragEnd={store.metaPressed ? null : onDragEnd}
        draggable={store.metaPressed ? 'false' : 'true'}
      >
        <Image
          onClick={() => !store.metaPressed && sendImage(imageUrl)}
          url={imageUrl}
          round={props.round}
          style={{
            opacity: dimTile ? 0.4 : 1,
          }}
        >
          {!store.metaPressed && (
            <Overlay
              round={props.round}
              className={isDrag ? 'placeholder' : ''}
            >
              <ImageHoverIcon />
            </Overlay>
          )}

          <img
            ref={ref}
            src={imageUrl}
            draggable="false"
            style={{
              zIndex: isDrag ? -1 : 1,
            }}
          />
        </Image>

        <TitleAndArtist
          style={{
            opacity: dimTile ? 0.4 : 1,
          }}
        >
          <div>
            <h4 onClick={() => !dimTile && sendText(props.name)}>
              {shortName}
            </h4>
          </div>
          <div>
            <p onClick={() => !dimTile && sendText(artists)}>{artists}</p>
          </div>
        </TitleAndArtist>
      </Wrapper>
    );
  }
);

const Overlay = styled.div<{ round: boolean }>`
  border-radius: ${(props) => (props.round ? '100%' : '5px')};
  /* pointer-events: none; */
  opacity: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  z-index: 2;
  background: linear-gradient(
    0deg,
    rgba(27, 196, 125, 0.8),
    rgba(27, 196, 125, 0.8)
  );
  transition: opacity 0.3s;
  svg {
    align-self: center;
    margin: 0 auto;
  }
  &.placeholder {
    opacity: 0.8;
    background: #e5e5e5;
    circle {
      opacity: 0.2;
      fill: #000;
    }
  }
`;

const TitleAndArtist = styled.div`
  h4,
  p {
    position: relative;
    display: inline-block;
    &:hover {
      &::after {
        position: absolute;
        content: '';
        right: -8px;
        left: -8px;
        bottom: -3px;
        top: -3px;
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 10px;
      }
    }
  }
  h4 {
    font-size: 16px;
    margin: 0 0 4px;
    cursor: pointer;
  }
  p {
    margin: 0;
    font-size: 11px;
    color: rgba(0, 0, 0, 0.7);
    cursor: pointer;
  }
`;

const Image = styled.div<{ round: boolean; url: string }>`
  position: relative;
  width: 100%;
  margin: 0 auto;
  cursor: pointer;

  &:hover {
    ${Overlay}:not(.placeholder) {
      opacity: 1;
    }
  }

  img {
    position: relative;
    width: 100%;
    border-radius: ${(props) => (props.round ? '100%' : '5px')};
    aspect-ratio: 1/1;
    object-fit: cover;
  }

  &::after {
    content: '';
    top: 25px;
    left: 12px;
    width: 80%;
    height: 80%;
    position: absolute;
    /* opacity: 0.7; */
    filter: blur(14.7347px);
    border-radius: 5.59184px;
    background-image: url(${(props) => props.url});
    background-size: cover;
  }
`;

const Wrapper = styled.div<{ grid: boolean }>`
  color: #000;
  width: ${(props) => (props.grid ? 'calc(50% - 7.5px)' : 'auto')};
  display: ${(props) => (props.grid ? 'block' : 'flex')};
  margin: ${(props) => (props.grid ? '0' : '0 0 10px 0')};
  ${Image} {
    width: ${(props) => (props.grid ? '100%' : '70px')};
    height: ${(props) => (props.grid ? 'auto' : '70px')};
    margin: ${(props) => (props.grid ? '0 auto' : '0 15px 0 0')};
  }
  ${TitleAndArtist} {
    align-self: center;
    width: ${(props) => (props.grid ? '100%' : 'calc(100% - 90px)')};
    h4 {
      margin: ${(props) => (props.grid ? '8px 0 4px' : '0 0 8px')};
    }
  }
`;
