import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Router } from "@reach/router";
import Menu from "@/pages/menu/index.jsx";
import { Loader } from "semantic-ui-react";
import AlertMessage from "./components/alertMessage";

const DataViz = React.lazy(() => import("@/pages/dataViz/index.jsx"));

const App = () => {
  const error = useSelector(state => state.error.errorMessage)
  
  return (
    <>
      <Suspense fallback={<Loader>Loading</Loader>}>
        <Router>
          <Menu exact path="/" />
          <DataViz exact path="/viz" />
        </Router>
      </Suspense>
      {error && <AlertMessage />}
    </>
  );
};

export default App;
