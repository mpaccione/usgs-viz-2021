import React, { useState, useRef } from "react";
import { Button, Input, Icon } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchWord } from "@/redux/reducers/vizSlice";

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

const SearchField = () => {
  const searchWord = useSelector((state) => state.viz.searchWord);
  const [search, setSearch] = useState("");
  const [inputRef, setInputFocus] = useFocus();
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
            ref={inputRef}
            onClick={setInputFocus}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter" && search !== "") {
                dispatch(setSearchWord(search));
                setSearch("");
              }
            }}
          />
          <Button
            id="searchButtonInactive"
            onClick={() => {
              if (search !== "") {
                dispatch(setSearchWord(search));
                setSearch("");
              }
            }}
            icon
          >
            <Icon name="search" />
          </Button>
        </div>
      ) : (
        <div id="searchField" className="active">
          <Button
            id="searchButtonActive"
            onClick={() => {
              setSearch("");
              dispatch(setSearchWord(""));
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
