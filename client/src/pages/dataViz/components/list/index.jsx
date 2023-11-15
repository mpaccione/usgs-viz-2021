import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Table, Column } from "react-virtualized";
import { Icon } from "semantic-ui-react";
import SearchField from "@/pages/dataViz/components/list/searchField.jsx";
import { setSelectedQuakeIndex } from "@/redux/reducers/vizSlice";
import { timeClass, formattedQuakeCount } from "@/helpers/dataVizList.js";
import "./index.scss";

const List = ({ mobile, feedIndex, feedTitle, quakes, searchWord }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [filteredData, setFilteredData] = useState(false);
  const dispatch = useDispatch();

  // TODO: Add in Local State for Super Responsive Virtualized Table

  // Search Filtering
  useEffect(() => {
    if (searchWord !== "") {
      const filteredBySearch = quakes[feedIndex].filter((quake) =>
        quake.location.toLowerCase().includes(searchWord.toLowerCase())
      );
      setFilteredData(filteredBySearch);
    } else {
      setFilteredData(false);
    }
  }, [searchWord]);

  return (
    <div
      id="leftMenu"
      className={
        !mobile
          ? "expanded"
          : mobile && showMobileMenu
          ? "expanded"
          : "contracted"
      }
      onMouseEnter={() => {
        window.controls.enabled = false;
      }}
      onMouseLeave={() => {
        window.controls.enabled = true;
      }}
    >
      <div id="quakeHeader">
        <h4 id="quakeTitle">
          {formattedQuakeCount(quakes, feedIndex)} {feedTitle[feedIndex]}
          {mobile && (
            <>
              <SearchField />
              <Icon
                name={`chevron ${showMobileMenu ? "up" : "down"}`}
                onClick={() => {
                  setShowMobileMenu(!showMobileMenu);
                }}
              />
            </>
          )}
        </h4>
        {!mobile && (
          <>
            <hr></hr>
            <SearchField />
            <hr></hr>
          </>
        )}
      </div>
      {quakes && (
        <Table
          id="quakeResults"
          width={mobile ? window.innerWidth : window.innerWidth * 0.2}
          height={window.innerHeight - 80}
          headerHeight={20}
          rowHeight={40}
          rowClassName={({ index }) => {
            return timeClass(quakes, feedIndex, index);
          }}
          rowCount={
            filteredData ? filteredData.length : quakes[feedIndex].length
          }
          rowGetter={({ index }) =>
            filteredData ? filteredData[index] : quakes[feedIndex][index]
          }
          onRowClick={({ rowData }) => {
            const index = quakes[feedIndex].findIndex((data) => data.location === rowData.location)
            dispatch(setSelectedQuakeIndex(index));
            setShowMobileMenu(false);
          }}
        >
          <Column dataKey="index" label="" width={15} />
          <Column
            width={
              mobile ? window.innerWidth - 60 : window.innerWidth * 0.2 - 60
            }
            dataKey="location"
            label="Location"
          />
          <Column
            width={45}
            dataKey="magnitude"
            label="Mag."
            cellDataGetter={({ rowData, dataKey }) => {
              return rowData[dataKey].toFixed(2);
            }}
          />
        </Table>
      )}
    </div>
  );
};

export default List;
