import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Layout } from '../components/Layout';
import { FyfillLogo } from '../components/icons/FyfillLogo';
import { LoadingIcon } from '../components/icons/LoadingIcon';
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
    window.open(store.api.authorizeUrl(secret));
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
    <Layout footer={<>This is not an official app from Spotify</>}>
      <Content>
        {loading ? (
          <Loading>
            <LoadingIcon />
            <h3>Waiting...</h3>
            <p>Sign in with your browser</p>
          </Loading>
        ) : (
          <Login>
            <Logo>
              <FyfillLogo width="40" height="40" />

              <h3>FYFILL</h3>
            </Logo>
            <Button onClick={connect}>
              <SpotifyLogo />
              <span>Login with Spotify</span>
            </Button>
          </Login>
        )}
      </Content>
    </Layout>
  );
});

const Content = styled.div`
  display: flex;
  align-self: center;
  width: 100%;
  height: 100%;
`;

const Loading = styled.div`
  text-align: center;
  align-self: center;
  width: 100%;
  color: #fff;

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

const Logo = styled.div`
  text-align: center;
  align-self: center;
  color: #fff;
  margin-top: 20px;
  img {
    width: 33px;
    height: 33px;
  }
  h3 {
    margin-bottom: 0;
  }
`;
const Login = styled.div`
  display: grid;
  grid-template-rows: 1fr 43px 33px;
  text-align: center;
  width: 100%;
  color: #fff;
  ${Logo} {
    h3 {
      letter-spacing: 2px;
    }
  }
`;

const Button = styled.button`
  align-self: center;
  background-color: #1db954;
  color: #fff;
  border-radius: 61px;
  padding: 12px 19px;
  border: 0;
  margin: 0 auto;
  cursor: pointer;
  filter: drop-shadow(0px 11px 28px rgba(0, 0, 0, 0.35));
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  font-size: 11px;
  span {
    margin-left: 10px;
  }
`;
