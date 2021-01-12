import React, { useState } from "react";
import { Button, Input } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchWord } from "@/redux/reducers/vizSlice";

const SearchField = () => {
  const searchWord = useSelector(state => state.viz.searchWord);
  const [search, setSearch] = useState();
  const dispatch = useDispatch();

  return (
    <>
      {searchWord === "" ? (
        <div id="searchField" className="inactive">
          <Input
            id="searchInput"
            type="text"
            placeholder="Enter Location Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter" && searchWord !== "") {
                dispatch(setSearchWord(searchWord));
              }
            }}
          />
          <Button
            id="searchButtonInactive"
            onClick={() => {
              if (searchWord !== "") {
                dispatch(setSearchWord(searchWord));
              }
            }}
          >
            Search
          </Button>
        </div>
      ) : (
        <div id="searchField" className="active">
          <Button
            id="searchButtonActive"
            onClick={() => {
              this.makeSearch(false);
            }}
          >
            Close Results
          </Button>
        </div>
      )}
    </>
  );
};

export default SearchField;
