import React from 'react'
import { Router } from "@reach/router"
import Menu from "@/pages/menu/index.jsx"
import DataViz from "@/pages/dataViz/index.jsx"



const App = () => (
    <Router>
        <Menu exact path="/" />
        <DataViz exact path="/viz" />
    </Router>
)

export default App