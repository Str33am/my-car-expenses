import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Redirect, Route } from 'react-router-dom';
import Expenses from '../expenses/Expenses';
import Cars from '../home/Cars';
import MyCar from '../myCar/MyCar';
import AppContainer from '../AppContainer';
import Loader from './Loader';
import NotFound from './NotFound';

const AppRoutes: React.FC = () => {

  return (
    <Router basename={'my-car-expenses'}>
      <Suspense fallback={<Loader />}>
        <AppContainer >
          <Switch>
            <Route exact path="/" component={MyCar} />
            <Route exact path="/cars" component={Cars} />
            <Route exact path="/expenses" component={Expenses} />

            <Route exact path="/404" component={NotFound} />
            <Redirect to="/404" />
          </Switch>
        </AppContainer>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
