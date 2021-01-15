import React, { useState, useRef } from "react";
import { Button, Input, Icon, Form } from "semantic-ui-react";
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
          {/* <Form> */}
          <Input
            id="searchInput"
            type="text"
            placeholder="Enter Location Search"
            value={search}
            ref={inputRef}
            onClick={
              setInputFocus
              // window.controls.enable = false;
              // setTimeout(() => {
              //   window.controls.enable = true;
              // }, 1000);
            }
            onChange={(e) => {
              console.log({ e });
              setSearch(e.target.value);
            }}
            onKeyUp={(e) => {
              console.log(e);
              if (e.key === "Enter" && search !== "") {
                setSearch("");
                dispatch(setSearchWord(searchWord));
              }
            }}
          />
          <Button
            id="searchButtonInactive"
            onClick={() => {
              if (search !== "") {
                setSearch("");
                dispatch(setSearchWord(searchWord));
              }
            }}
            icon
          >
            <Icon name="search" />
          </Button>
          {/* </Form> */}
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
