import React, { Suspense } from "react";
import { Router } from "@reach/router";
import Menu from "@/pages/menu/index.jsx";
import { Loader } from "semantic-ui-react";

const DataViz = React.lazy(() => import("@/pages/dataViz/index.jsx"));

const App = () => (
  <Suspense fallback={<Loader>Loading</Loader>}>
    <Router>
      <Menu exact path="/" />
      <DataViz exact path="/viz" />
    </Router>
  </Suspense>
);

export default App;
