// LIBRARIES
import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

// PAGES
import Home from './pages/Home';
import InvisibleThingBak from './pages/InvisibleThingBak';
import InvisibleThing from './pages/InvisibleThing';
import CreateThing from './pages/CreateThing';
import Erro404 from './pages/Erro404';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={InvisibleThingBak} path="/bak" exact />
        <Route component={Home} path="/" exact />
        <Route component={CreateThing} path="/create-thing" exact />
        <Route component={InvisibleThing} path="/play" exact />
        <Route component={Erro404} path="/erro404" exact />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes;