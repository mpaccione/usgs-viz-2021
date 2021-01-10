import React from "react";
import { useDispatch } from "react-redux";
import { Table, Column } from "react-virtualized";
import SearchResult from "@/pages/dataViz/components/searchResult.jsx";
import SearchField from "@/pages/dataViz/components/list/searchField.jsx";
import { setSelectedQuakeIndex } from "@/redux/reducers/vizSlice";
import { timeClass, formattedQuakeCount } from "@/helpers/dataVizList.js";

const List = ({feedIndex, feedTitle, quakes, selectedQuakeIndex}) => {
  const dispatch = useDispatch();

  // TODO: Move Mobile Logic Higher and Pass as Param and Finish Logic - NOT FINISHED
  return (
    <div id="leftMenu" className={this.mobileMenuClass()}>
      <div id="quakeHeader">
        <h4 id="quakeTitle">{feedTitle[feedIndex]}</h4>
        <h4 id="quakeTotal">
          {this.mobileMenuArrow()}
          {formattedQuakeCount()}
        </h4>
      </div>
      <SearchField />
      <Table
        id="quakeResults"
        width={
          window.innerWidth >= 1440
            ? window.innerWidth * 0.2
            : window.innerWidth
        }
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
          width={
            window.innerWidth >= 1440
              ? window.innerWidth * 0.2 - 60
              : window.innerWidth - 60
          }
          dataKey="location"
          label="Location"
        />
        <Column width={45} dataKey="magnitude" label="Mag." />
      </Table>
      <SearchResult />
    </div>
  );
};

export default List;
