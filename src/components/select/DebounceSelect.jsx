import {
  FormControl,
  Select,
  IconButton,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React from "react";
export default function DebounceSelect({
  children,
  value,
  onChange,
  onClear,
  label,
  placeholder,
  width = "100%",
  ...props
}) {
  const hasValue = value !== "" && value !== null && value !== undefined;
  const labelId = `select-label-${label?.replace(/\s/g, "")}`;

  return (
    <FormControl size="small" sx={{ width: width }} variant="outlined">
      <InputLabel id={labelId} shrink={hasValue || props.displayEmpty}>
        {label}
      </InputLabel>

      <Select
        sx={{ borderRadius: 2.5 }}
        IconComponent={KeyboardArrowDownIcon}
        labelId={labelId}
        value={value ?? ""}
        onChange={onChange}
        label={label}
        displayEmpty={!!placeholder}
        renderValue={(selectedId) => {
          if (!hasValue && placeholder) {
            return <span style={{ color: "#9e9e9e" }}>{placeholder}</span>;
          }

          const selectedItem = React.Children.toArray(children).find(
            (child) => child.props.value === selectedId,
          );

          return selectedItem ? selectedItem.props.children : selectedId;
        }}
        endAdornment={
          hasValue ? (
            <InputAdornment
              position="end"
              sx={{ mr: 2, position: "absolute", right: "20px" }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear?.();
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }
        {...props}
      >
        {/* {placeholder && (
          <MenuItem disabled value="">
            {placeholder}
          </MenuItem>
        )} */}

        {children}
      </Select>
    </FormControl>
  );
}
