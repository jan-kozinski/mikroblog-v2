import { Provider } from "react-redux";
import store from "./app-state/store";
import Wall from "./components/layout/Wall";
function App() {
  return (
    <Provider store={store}>
      <Wall />
    </Provider>
  );
}

export default App;
