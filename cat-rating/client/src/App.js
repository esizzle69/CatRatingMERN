import React from 'react';
import Login from './pages/Login';
import CatProfiles from './pages/CatProfiles';
import Profile from './pages/Profile';
import Rankings from './pages/Rankings';
import Rating from './pages/Rating';
import Admin from './pages/Admin';
import Register from './pages/Register';

import { Route, Switch, BrowserRouter } from 'react-router-dom';

class App extends React.Component {

  render() {
      return (
          <div>
          <BrowserRouter>
            <Switch> { /* Similar to a switch statement - shows the component depending on the URL path */ }
              { /* Each Route below shows a different component depending on the exact path in the URL  */ }
              <Route exact path='/' render={() =>
            (<Login />)}/>
                  <Route exact path='/Register' component={Register} render={() =>
                      (<Register />)}/>
                  <Route exact path='/:uid/Rating' component={Rating} render={() =>
                  (<Rating />)}/>
                  {/* <Route exact path='/Profile' component={Profile} render={() =>
                    (<Profile />)}/> */}
                  <Route exact path='/:uid/Profile' component={Profile} render={() =>
                    (<Profile />)}/>
                  <Route exact path='/:uid/Rankings' component={Rankings} render={() =>
                    (<Rankings />)}/>
                  <Route exact path='/:uid/CatProfiles/:cid' component={CatProfiles} render={() =>
                    (<CatProfiles />)}/>
                  <Route exact path='/:uid/Admin' component={Admin} render={() =>
                      (<Admin />)}/>
            </Switch>
          </BrowserRouter>
        </div>
      );
    }

}

export default App;
