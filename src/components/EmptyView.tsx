import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { EmptyIcon } from './icons/EmptyIcon';

interface Props {
  title?: string;
  description?: string | React.ReactElement;
}

export const EmptyView: FunctionComponent<Props> = observer((props) => {
  return (
    <Wrapper>
      <EmptyIcon />
      <h2>{props.title}</h2>
      {props.description && <p>{props.description}</p>}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  align-self: center;
  flex-direction: column;
  height: 100%;

  h2 {
    margin: 30px 0 5px;
    color: #000;
    font-size: 23px;
  }
  p {
    margin: 0;
    font-size: 11px;
    color: rgba(0, 0, 0, 0.3);
  }
`;
