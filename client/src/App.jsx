import React, { Suspense } from "react";
import { Loader } from "semantic-ui-react";
import { Router } from "@reach/router";
import { useSelector } from "react-redux";

import AlertMessage from "./components/alertMessage";
import Menu from "@/pages/menu/index.jsx";
import PrivacyPolicy from "./pages/privacyPolicy";

const DataViz = React.lazy(() => import("@/pages/dataViz/index.jsx"));

const App = () => {
  const error = useSelector(state => state.error.errorMessage)
  
  return (
    <>
      <Suspense fallback={<Loader>Loading</Loader>}>
        <Router>
          <Menu exact path="/" />
          <DataViz exact path="/viz" />
          <PrivacyPolicy exact path="/privacy-policy" />
        </Router>
      </Suspense>
      {error && <AlertMessage />}
    </>
  );
};

export default App;
