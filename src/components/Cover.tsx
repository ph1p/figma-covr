import axios from 'axios';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import FigmaMessageEmitter from '../utils/MessageEmitter';
import { AlbumItem } from '../utils/interfaces';

import { ImageHoverIcon } from './icons/ImageHoverIcon';

export const Cover: FunctionComponent<
  AlbumItem & { grid?: boolean }
> = observer((props: AlbumItem & { grid?: boolean }) => {
  const imageUrl = props.images[0].url;
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const ref = useRef(null);

  const artists = useMemo(
    () => props.artists.map((artist) => artist.name).join(' & '),
    [props.artists]
  );

  const shortName = useMemo(() => {
    const maxLength = props.grid ? 10 : 20;
    let name = props.name;

    if (name.length > maxLength) {
      name = name.substr(0, maxLength);
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

  return (
    <Wrapper
      key={props.id}
      grid={props.grid}
      data-url={imageUrl}
      data-name={props.name}
      data-artists={artists}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable="true"
    >
      <Image ref={ref} onClick={() => sendImage(imageUrl)}>
        {!isDrag && (
          <Overlay>
            <ImageHoverIcon />
          </Overlay>
        )}
        <img src={imageUrl} draggable="false" />
      </Image>

      <TitleAndArtist>
        <div>
          <h4 onClick={() => sendText(props.name)}>{shortName}</h4>
        </div>
        <div>
          <p onClick={() => sendText(artists)}>{artists}</p>
        </div>
      </TitleAndArtist>
    </Wrapper>
  );
});

const Overlay = styled.div`
  pointer-events: none;
  opacity: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
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
        background-color: rgba(255, 255, 255, 0.15);
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
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
  }
`;

const Image = styled.div`
  position: relative;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
  margin: 0 auto;
  cursor: pointer;

  &:hover {
    box-shadow: 1px 1px 1px #000;
    ${Overlay} {
      opacity: 1;
    }
  }

  img {
    width: 100%;
  }
`;

const Wrapper = styled.div<{ grid: boolean }>`
  color: #fff;
  width: ${(props) => (props.grid ? 'calc(50% - 7.5px)' : 'auto')};
  display: ${(props) => (props.grid ? 'block' : 'flex')};
  margin: ${(props) => (props.grid ? '0' : '0 0 10px 0')};
  ${Image} {
    width: ${(props) => (props.grid ? '100%' : '70px')};
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
