import { observer } from 'mobx-react';
import { useEffect, useState } from 'preact/hooks';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import BackgroundImage from '../assets/bg.png';
import { Layout } from '../components/Layout';
import { LoadingIcon } from '../components/icons/LoadingIcon';
import { Logo } from '../components/icons/Logo';
import { SpotifyLogo } from '../components/icons/SpotifyLogo';
import { useStore } from '../store';
import { useInterval } from '../utils/hooks';

export const LoginView: FunctionComponent = observer(() => {
  const store = useStore();
  const [loading, setLoading] = useState(false);
  const [secret, setSecret] = useState(null);
  const [count, setCount] = useState(0);

  const connect = () => {
    const secret = Math.random().toString(36).substr(2, 9);
    window.open(store.api.generateAuthorizeUrl(secret));
    setSecret(secret);
    setLoading(true);
  };

  useInterval(
    () => {
      store.api
        .getUserTokenFromServer(secret)
        .then((data) => setTimeout(() => data && store.setUser(data), 500))
        .catch(() => {
          setSecret(null);
          setLoading(false);
          store.logout();
          store.setNotification({
            title: 'There was an error',
            subtitle: 'Please try to login again',
          });
        });
      setCount(count + 1);
    },
    secret && loading ? 1000 : null
  );

  useEffect(() => {
    if (count > 30) {
      store.setNotification({
        title: 'Please try again',
        subtitle: 'Login process took too long',
      });
      setSecret(null);
      setLoading(false);
      store.logout();
    }
  }, [count]);

  return (
    <Layout background={BackgroundImage}>
      <Content>
        {loading ? (
          <Loading>
            <LoadingIcon />
            <h3>Waiting...</h3>
            <p>Sign in with your browser</p>
          </Loading>
        ) : (
          <Login>
            <Welcome>
              Welcome to <strong>covr.</strong>
              <br />
              Your daily driver to
              <br />
              look for album and
              <br />
              podcast art
            </Welcome>
            <Button onClick={connect}>
              <SpotifyLogo />
              <span>Connect with Spotify</span>
            </Button>
            <Footer>
              All rights reserved by spotify No official
              <br />
              Spotify plugin
            </Footer>
          </Login>
        )}
      </Content>
    </Layout>
  );
});

const Footer = styled.div`
  color: #000;
  opacity: 0.2;
  font-size: 11px;
  align-self: center;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Loading = styled.div`
  text-align: center;
  width: 100%;

  padding: 320px 0 0 0;
  svg {
    animation: spin 1s linear forwards infinite;
  }

  h3 {
    font-size: 18px;
    margin: 20px 0 0 0;
  }
  p {
    opacity: 0.4;
    font-size: 11px;
  }
`;

const Welcome = styled.div`
  font-size: 23px;
  text-align: left;
  letter-spacing: -1px;
`;

const Login = styled.div`
  display: grid;
  padding-top: 300px;
  grid-template-rows: 133px 39px 62px;
  text-align: center;
  width: 100%;
  padding: 295px 22px 0;
`;

const Button = styled.button`
  width: 100%;
  align-self: center;
  /* background-color: #1db954; */
  background-color: #000;
  color: #fff;
  border-radius: 61px;
  padding: 10px 12px 9px;
  border: 0;
  margin: 0 auto;
  cursor: pointer;
  box-shadow: 0px 11px 28px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  letter-spacing: 1px;
  font-size: 12px;
  span {
    margin: 0 33px;
  }
`;
