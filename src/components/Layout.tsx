import { observer } from 'mobx-react';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

interface Props {
  footer?: JSX.Element;
  background?: string;
}

export const Layout: FunctionComponent<PropsWithChildren<Props>> = observer(
  (props: PropsWithChildren<Props>) => {
    return (
      <View hasFooter={!!props.footer} background={props.background}>
        <Content>{props.children}</Content>
        {props.footer && <Footer>{props.footer}</Footer>}
      </View>
    );
  }
);

const Footer = styled.footer`
  text-align: center;
  /* overflow: auto; */
  height: 50px;
  padding: 10px;
  color: #000;
  opacity: 0.3;
  font-size: 11px;
  width: 100%;
`;

const View = styled.div<{ hasFooter: boolean; background?: string }>`
  /* display: grid; */
  /* overflow: auto; */
  background: #fff;

  ${(props) =>
    props.background
      ? `
      background-image: url(${props.background});
      background-repeat: no-repeat;
      background-position:right -38px;`
      : ''};
  /* grid-template-rows: ${(props) =>
    props.hasFooter ? 'calc(100vh - 50px) 50px' : '100vh'}; */
`;

const Content = styled.div`
  position: relative;
  /* overflow: auto; */
`;
