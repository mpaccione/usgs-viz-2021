import React from 'react'
import { Router } from "@reach/router"
import MenuScreen from "./pages/menuScreen/index.jsx"
// import DataViz from "./pages/dataViz"



const App = () => (
    <Router>
        <MenuScreen exact path="/" />
        {/* <DataViz exact path="/viz" /> */}
    </Router>
)

export default App