import React,{useContext} from 'react';
import Home from './routes/home/home'
import Login from './routes/Login/Login'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
  } from "react-router-dom";
import { AuthContext } from "./Context/Authcontext"
import loginSuccess from './containers/loginSuccess/loginSuccess'

function App(){
    const { user } = useContext(AuthContext);
    return (
      <Router>
        <Switch>
          <Route exact path="/">{user ? <Home /> : <Redirect to="/login" />}</Route>
          <Route exact path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
          <Route exact path="/login/success" component={loginSuccess} />
          <Route exact path="/login/failure"><p>Error logging in. Try Again</p></Route>
        </Switch>
      </Router>
    );
};

export default App;