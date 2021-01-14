import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Column } from "react-virtualized";
import { timeClass } from "@/helpers/dataVizList.js";

const SearchList = ({ threeData, quakes, feedIndex, selectedQuakeIndex }) => {
  const [filteredQuakes, setFilteredQuakes] = useState();
  const [filteredQuakesIndexes, setFilteredQuakesIndexes] = useState();
  const searchWord = useSelector((state) => state.viz.searchWord);
  const dispatch = useDispatch();

  const searchFilter = () => {
    const fQuakes = [];
    const fQuakesIndexes = [];
    const searchButton = document.getElementById("searchButtonActive");

    quakes[feedIndex].filter((quake, index) => {
      if (quake.location.toLowerCase().includes(searchWord.toLowerCase())) {
        fQuakes.push(quake);
        fQuakesIndexes.push(index);
      }
    });

    setFilteredQuakes(fQuakes);
    setFilteredQuakesIndexes(fQuakesIndexes);

    if (searchButton) {
      searchButton.innerHTML = `Close ${filteredQuakes.length} Results`;
    }
  };

  return (
    <>
      {!filteredQuakes || filteredQuakes.length === 0 ? (
        <h3>No Results Found.</h3>
      ) : (
        
          <Table
            id="searchResults"
            className={
              searchWord !== "" && filteredQuakes.length !== 0
                ? "searchActive"
                : "searchInactive"
            }
            width={mobile ? window.innerWidth : window.innerWidth * 0.2}
            height={window.innerHeight - 80}
            headerHeight={20}
            rowHeight={50}
            rowClassName={({ index }) => {
              return timeClass(index);
            }}
            rowCount={filteredQuakes.length}
            rowGetter={({ index }) => filteredQuakes[index]}
            onRowClick={({ index }) =>
              dispatch(setSelectedQuakeIndex(filteredQuakesIndexes[index]))
            }
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
      )}
    </>
  );
};

export default SearchList;
