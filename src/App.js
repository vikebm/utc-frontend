import './App.css';
import Routes from "./navigation/routes";
import { Loader, Footer } from "./components";
import { LoaderContext } from "./context";
import { useReducer, useMemo } from "react";

function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "LOAD":
          return {
            ...prevState,
            isLoading: true,
          };
        case "LOAD_READY":
          return {
            ...prevState,
            isLoading: false,
          };
        default:
          break;
      }
    },
    {
      isLoading: false,
    }
  );

  const loaderContext = useMemo(() => ({
    loadingActive: async () => {
      dispatch({ type: "LOAD" });
    },
    loadingDisabled: async () => {
      dispatch({ type: "LOAD_READY" })
    },
  }), []);

  return (
    <div className="App">
        <LoaderContext.Provider value={loaderContext}>
          <Loader loading={state.isLoading} />
          <Routes />
        </LoaderContext.Provider>
      <Footer/>
    </div>
  );
}

export default App;
