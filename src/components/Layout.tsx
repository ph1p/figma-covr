import { observer } from 'mobx-react';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

interface Props {
  footer?: JSX.Element;
}

export const Layout: FunctionComponent<PropsWithChildren<Props>> = observer(
  (props: PropsWithChildren<Props>) => {
    return (
      <View hasFooter={!!props.footer}>
        <Content>{props.children}</Content>
        {props.footer && <Footer>{props.footer}</Footer>}
      </View>
    );
  }
);

const Footer = styled.footer`
  text-align: center;
  overflow: auto;
  height: 50px;
  padding: 10px;
  color: #fff;
  opacity: 0.3;
  font-size: 11px;
  width: 100%;
`;

const View = styled.div`
  display: grid;
  overflow: auto;
  background: radial-gradient(
      130.67% 77.89% at 104.21% 8.71%,
      rgba(35, 174, 84, 0.2) 0%,
      rgba(29, 185, 84, 0) 100%
    ),
    #121212;
  grid-template-rows: ${(props) =>
    props.hasFooter ? 'calc(100vh - 50px) 50px' : '100vh'};
`;

const Content = styled.div`
  position: relative;
  overflow: auto;
`;
