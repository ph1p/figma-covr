import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';

import { useStore } from '../store';

import { CloseIcon } from './icons/CloseIcon';
import { WarningIcon } from './icons/WarningIcon';

export const Notification = observer(() => {
  const store = useStore();

  return store.notification ? (
    <Wrapper>
      <Close onClick={() => store.setNotification(null)}>
        <CloseIcon />
      </Close>
      <WarningIcon />
      <div>
        <strong>{store.notification.title}</strong>
        <p>{store.notification.subtitle}</p>
      </div>
    </Wrapper>
  ) : (
    <></>
  );
});

const Close = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  top: 17px;
  left: 17px;
  right: 17px;
  border-radius: 5px;
  z-index: 30;
  padding: 15px 20px;
  background-color: #000000;
  color: #fff;
  align-items: center;
  p {
    margin: 2px 0 0;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
  }
  div {
    margin-left: 18px;
  }
`;
