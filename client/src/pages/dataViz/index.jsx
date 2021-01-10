import React, { useState } from 'react'
import { useSelector } from "semantic-ui-react"
import List from "@/pages/dataViz/components/list/index.jsx"
import Options from "@/pages/dataViz/components/options/index.jsx"
import Animation from "@/pages/dataViz/components/animation/index.jsx"
import Modal from "@/components/modal/index.jsx"

const DataViz = () => {
    // TODO: Performance Check Rerendering Individual vs Parent Selector
    // Options
    // const feedIndex = useSelector(state.options.feedIndex);
    // const feedTitle = useSelector(state.options.feedTitle);
    // const autoRotation = useSelector(state.options.autoRotation);
    // const clickXRotation = useSelector(state.options.clickXRotation);
    // const clickYRotation = useSelector(state.options.clickYRotation);
    // const simulationGlobe = useSelector(state.options.simulationGlobe);
    // const physicalGlobe = useSelector(state.options.physicalGlobe);
    // const politicalGlobe = useSelector(state.options.politicalGlobe);
    // const tectonicGlobe = useSelector(state.options.tectonicGlobe);
    const options = useSelector(state.options)
    // Viz
    // const quakes = useSelector(state.viz.quakes);    
    // const threeData = useSelector(state.viz.threeData);    
    // const selectedQuakeIndex = useSelector(state.viz.selectedQuakeIndex);  
    // const vizTextureRendered = useSelector(state.viz.vizTextureRendered);  
    const viz = useSelector(state.viz)
    /////
    const [mobile, setMobile] = useState(window.innerWidth < 1440 ? true : false);
  
    const resizeHandler = () => {
      window.innerWidth < 1440 ? setMobile(true) : setMobile(false); // TODO: Throttle
    };
  
    useEffect(() => {
      window.addEventListener("resize", resizeHandler);
      return () => window.removeEventListener("resize", resizeHandler);
    }, []);

    return (
        <>
            <List mobile={mobile} feedIndex={options.feedIndex} feedTitle={options.feedTitle} quakes={viz.quakes} selectedQuakeIndex={viz.selectedQuakeIndex} />
            <Animation mobile={mobile} options={options} viz={viz} />
            <Options mobile={mobile} options={options} threeData={viz.threeData} vizTextureRendered={viz.vizTextureRendered} />
            <Modal open={modalText.length > 0} />
        </>
    )
}

export default DataViz;
