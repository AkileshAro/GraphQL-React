import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from='/' to='/auth' exact />
        <Route path='/auth' component={AuthPage}></Route>
        <Route path='/events' component={EventsPage}></Route>
        <Route path='/bookings' component={BookingsPage}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;