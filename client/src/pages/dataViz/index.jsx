import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import List from "@/pages/dataViz/components/list/index.jsx";
import Options from "@/pages/dataViz/components/options/index.jsx";
import Animation from "@/pages/dataViz/components/animation/index.jsx";
import Modal from "@/components/modal/index.jsx";
import "./index.scss";

const DataViz = () => {
  const options = useSelector((state) => state.option);
  const viz = useSelector((state) => state.viz);
  const modalText = useSelector((state) => state.modal.modalText);
  const [mobile, setMobile] = useState(window.innerWidth < 1440 ? true : false);

  const resizeHandler = () => {
    window.innerWidth < 1440 ? setMobile(true) : setMobile(false);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <>
      <List
        mobile={mobile}
        feedIndex={options.feedIndex}
        feedTitle={options.feedTitle}
        quakes={viz.quakes}
        threeData={viz.threeData}
        searchWord={viz.searchWord}
      />
      <Animation
        mobile={mobile}
        feedIndex={options.feedIndex}
        clickXRotation={options.clickXRotation}
        clickYRotation={options.clickYRotation}
        autoRotation={options.autoRotation}
        globes={{
          simulationGlobe: options.simulationGlobe,
          physicalGlobe: options.physicalGlobe,
          politicalGlobe: options.politicalGlobe,
          tectonicGlobe: options.tectonicGlobe,
        }}
        selectedQuake={
          viz.quakes !== undefined
            ? viz.quakes[options.feedIndex][viz.selectedQuakeIndex]
            : false
        }
        vizNeedsUpdate={viz.vizNeedsUpdate}
      />
      <Options
        mobile={mobile}
        options={options}
        threeData={viz.threeData}
        vizTextureRendered={viz.vizTextureRendered}
      />
      <Modal open={modalText.length > 0} />
    </>
  );
};

export default DataViz;
