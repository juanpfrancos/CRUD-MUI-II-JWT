import React, { useState, useEffect, Suspense } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import AuthService from './services/auth.service';

const Tab = React.lazy(() => import('./crud/Tab'));
const SignIn = React.lazy(() => import('./Login'));
const SignUp = React.lazy(() => import('./Register'));

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <Suspense fallback={(
      <>
        <div style={{ height: '100%', display: 'flex' }}>
          <Grid
            container
            spacing={0}
            align="center"
            justify="center"
            direction="column"
          >
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        </div>
      </>
)}
    >
      <Switch>
        <Route exact path={['/', '/login']} component={SignIn} />
        <Route path="/user" component={Tab} />
        <Route path="/signup" component={SignUp} />
      </Switch>
    </Suspense>
  );
};

export default App;
