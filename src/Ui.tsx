import { observer } from 'mobx-react';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  MemoryRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import styled from 'styled-components';

import { FloatingNavigation } from './components/FloatingNavigation';
import { Notification } from './components/Notification';
import { StoreProvider, trunk, getStoreFromMain, useStore } from './store';
import { DashboardView } from './views/Dashboard';
import { LibraryView } from './views/Library';
import { LoginView } from './views/Login';

import './style.css';

const AppWrapper = styled.div`
  overflow: hidden;
`;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function FilterRoute({ children, authed, redirect, ...props }) {
  return authed ? (
    <Route {...props}>{children}</Route>
  ) : (
    <Redirect to={{ pathname: redirect, state: { from: props.location } }} />
  );
}

const App = observer(() => {
  const store = useStore();

  return (
    <AppWrapper>
      <Router>
        <Notification />
        <Switch>
          <FilterRoute
            authed={!store.isAuthenticated}
            redirect="/dashboard"
            exact
            path="/"
          >
            <LoginView />
          </FilterRoute>
          <FilterRoute
            authed={store.isAuthenticated}
            exact
            path="/dashboard"
            redirect="/"
          >
            <DashboardView />
          </FilterRoute>
          <FilterRoute
            authed={store.isAuthenticated}
            exact
            path="/library"
            redirect="/"
          >
            <LibraryView />
          </FilterRoute>
        </Switch>
        {store.isAuthenticated && <FloatingNavigation />}
      </Router>
    </AppWrapper>
  );
});

getStoreFromMain().then((store) =>
  trunk.init(store).then(() => {
    ReactDOM.render(
      <StoreProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StoreProvider>,
      document.getElementById('app')
    );
  })
);
