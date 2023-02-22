import { observer } from 'mobx-react';
import { useEffect } from 'preact/hooks';
import React, { FunctionComponent } from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  MemoryRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import styled from 'styled-components';

import { FloatingNavigation } from './components/FloatingNavigation';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { StoreProvider, trunk, getStoreFromMain, useStore } from './store';
import { AlbumsView } from './views/Albums';
import { ArtistsView } from './views/Artists';
import { DashboardView } from './views/Dashboard';
import { LoginView } from './views/Login';
import { PlaylistView } from './views/Playlist';
import { PlaylistsView } from './views/Playlists';
import { TracksView } from './views/Tracks';

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

const AuthRoutes: FunctionComponent<{ isLogin?: boolean }> = observer(
  ({ isLogin = false }): JSX.Element => {
    const store = useStore();
    const location = useLocation();

    if (isLogin) {
      if (store.isAuthenticated && location.pathname === '/') {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
      }
    } else {
      if (!store.isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
      }
    }

    return <Outlet />;
  }
);

const App = observer(() => {
  const store = useStore();

  useEffect(() => {
    const shiftDown = (e) => {
      if (e.key === 'Shift' && store.shiftEnabled) {
        store.setShiftPressed(true);
      }
    };

    const shiftUp = (e) => {
      if (e.key === 'Shift' && store.insertItems.length === 0 && store.shiftEnabled) {
        store.setShiftPressed(false);
      }
    };

    window.addEventListener('keydown', shiftDown);
    window.addEventListener('keyup', shiftUp);

    return () => {
      window.removeEventListener('keydown', shiftDown);
      window.removeEventListener('keyup', shiftUp);
    };
  }, []);

  return (
    <AppWrapper>
      <Router>
        {store.isAuthenticated && <Header />}
        <Notification />
        <Routes>
          <Route element={<AuthRoutes isLogin />}>
            <Route path="/" element={<LoginView />} />
          </Route>
          <Route element={<AuthRoutes />}>
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/albums" element={<AlbumsView />} />
            <Route path="/tracks" element={<TracksView />} />
            <Route path="/artists" element={<ArtistsView />} />
            <Route path="/playlists">
              <Route element={<PlaylistsView />} index />
              <Route path=":id" element={<PlaylistView />} />
            </Route>
          </Route>
        </Routes>
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
