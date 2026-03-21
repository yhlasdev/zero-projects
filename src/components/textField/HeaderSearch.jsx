import { TextField, IconButton, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useState, useEffect, useRef, useCallback } from "react";

export default function HeaderSearch({ value, onSearch, debounceTime = 500 }) {
  const [inputValue, setInputValue] = useState(value || "");
  const debouncedRef = useRef(null);
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    if (debouncedRef.current) clearTimeout(debouncedRef.current);
    debouncedRef.current = setTimeout(() => {
      onSearchRef.current(inputValue);
    }, debounceTime);
    return () => clearTimeout(debouncedRef.current);
  }, [inputValue, debounceTime]); 

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        if (debouncedRef.current) clearTimeout(debouncedRef.current);
        onSearchRef.current(inputValue);
      }
    },
    [inputValue],
  );

  const handleClear = useCallback(() => {
    if (debouncedRef.current) clearTimeout(debouncedRef.current);
    setInputValue("");
    onSearchRef.current(""); 
  }, []);

  return (
    <TextField
      size="small"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Search..."
      sx={{
        width: 290,
        "& .MuiOutlinedInput-root": { borderRadius: 2.5, pl: 0.5 },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon  sx={{marginLeft: 1, fontSize: 19}}/>
          </InputAdornment>
        ),
        endAdornment: inputValue ? (
          <InputAdornment position="end">
            <IconButton onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}
