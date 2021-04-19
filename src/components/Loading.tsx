import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { LoadingIcon } from '../components/icons/LoadingIcon';

interface Props {
  description?: string;
}

export const LoadingScreen: FunctionComponent<Props> = observer((props) => {
  return (
    <EmptyScreen>
      <LoadingIcon />
      <h4>loading...</h4>
      {props.description && <p>Retrieving the Album Library</p>}
    </EmptyScreen>
  );
});

const EmptyScreen = styled.div`
  width: 100%;
  text-align: center;
  justify-content: center;
  align-self: center;
  svg {
    animation: spin 1s linear forwards infinite;
  }

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
