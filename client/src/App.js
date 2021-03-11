import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import Login from "./components/views/LoginPage/LoginPage";
import Signup from "./components/views/SignUpPage/SignUpPage";
import Auth from "./hoc/auth";
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Auth(LandingPage, null)} />
        <Route exact path="/login" component={Auth(Login, false)} />
        <Route exact path="/signup" component={Auth(Signup, false)} />
      </Switch>
    </Router>
  );
}

export default App;
