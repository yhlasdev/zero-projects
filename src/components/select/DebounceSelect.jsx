import {
  FormControl,
  Select,
  IconButton,
  InputAdornment,
  InputLabel,
  useColorScheme,
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
  hasCancel = false,
  ...props
}) {
  const hasValue = Array.isArray(value) ? value.length > 0 : (value !== "" && value !== null && value !== undefined);
  const labelId = `select-label-${label?.replace(/\s/g, "")}`;
  const { mode } = useColorScheme();
  return (
    <FormControl size="small" sx={{ width: width }} variant="outlined">
      <InputLabel
        sx={{
          "&.Mui-focused": {
            color: mode === "dark" ? "#fff" : "",
          },
        }}
        id={labelId}
        shrink={hasValue || props.displayEmpty}
      >
        {label}
      </InputLabel>

      <Select
        sx={{ borderRadius: 2.5 }}
        IconComponent={KeyboardArrowDownIcon}
        labelId={labelId}
        value={value ?? (props.multiple ? [] : "")}
        onChange={onChange}
        label={label}
        displayEmpty={!!placeholder}
        renderValue={(selected) => {
          if (!hasValue && placeholder) {
            return <span style={{ color: "#9e9e9e" }}>{placeholder}</span>;
          }

          if (props.multiple) {
            return selected.join(', ');
          }

          const selectedItem = React.Children.toArray(children).find(
            (child) => child.props.value === selected,
          );

          return selectedItem ? selectedItem.props.children : selected;
        }}
        endAdornment={
          hasValue && !hasCancel ? (
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

        {children}
      </Select>
    </FormControl>
  );
}
