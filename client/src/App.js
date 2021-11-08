import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app-state/store";
import Wall from "./components/layout/Wall";
import Wrapper from "./components/layout/Wrapper";
import WebSocketWrapper from "./components/WebSocketWrapper";
function App() {
  return (
    <Provider store={store}>
      <WebSocketWrapper>
        <Router>
          <Switch>
            <Route path="/" exact>
              <Wrapper>
                <Wall />
              </Wrapper>
            </Route>
          </Switch>
        </Router>
      </WebSocketWrapper>
    </Provider>
  );
}

export default App;
