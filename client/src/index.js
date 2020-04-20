import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.jsx";
import RTL from "layouts/RTL.jsx";

import "assets/css/material-dashboard-react.css?v=1.6.0";
// import NotifierSnackbar from "./components/Snackbar/NotifierSnackBar.jsx";

const hist = createBrowserHistory();

var element = (
  <Router history={hist}>
    <Switch>
      <Route path="/project" component={Admin} />
      <Route path="/rtl" component={RTL} />
      <Redirect from="/" to="/project" />
    </Switch>
  </Router>
);
/*var cc = (
  <NotifierSnackbar open={true} message={"dsdsddsdsdds"} />
);*/
ReactDOM.render(element, document.getElementById("root"));
