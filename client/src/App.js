import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app-state/store";
import Wall from "./components/layout/Wall";
import Wrapper from "./components/layout/Wrapper";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Wrapper>
              <Wall />
            </Wrapper>
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
