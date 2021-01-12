import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Table, Column } from "react-virtualized";
import SearchList from "@/pages/dataViz/components/list/searchList.jsx";
import SearchField from "@/pages/dataViz/components/list/searchField.jsx";
import { setSelectedQuakeIndex } from "@/redux/reducers/vizSlice";
import { timeClass, formattedQuakeCount } from "@/helpers/dataVizList.js";

const List = ({ mobile, feedIndex, feedTitle, quakes, selectedQuakeIndex }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dispatch = useDispatch();

  return (
    <div
      id="leftMenu"
      className={mobile && showMobileMenu ? "expanded" : "contracted"}
    >
      <div id="quakeHeader">
        <h4 id="quakeTitle">{feedTitle[feedIndex]}</h4>
        <h4 id="quakeTotal">
          {mobile && (
            <span
              className="down-arrow"
              onClick={() => {
                setShowMobileMenu(!mobileMenuShow);
              }}
            ></span>
          )}
          {formattedQuakeCount(quakes, feedIndex)}
        </h4>
      </div>
      <SearchField />
      <Table
        id="quakeResults"
        width={mobile ? window.innerWidth : window.innerWidth * 0.2}
        height={window.innerHeight - 80}
        headerHeight={20}
        rowHeight={50}
        rowClassName={({ index }) => {
          return timeClass(quakes, feedIndex, index);
        }}
        rowCount={quakes[feedIndex].length}
        rowGetter={({ index }) => quakes[feedIndex][index]}
        onRowClick={({ index }) => dispatch(setSelectedQuakeIndex(index))}
      >
        <Column dataKey="index" label="" width={15} />
        <Column
          width={mobile ? window.innerWidth - 60 : window.innerWidth * 0.2 - 60}
          dataKey="location"
          label="Location"
        />
        <Column width={45} dataKey="magnitude" label="Mag." />
      </Table>
      <SearchList />
    </div>
  );
};

export default List;
