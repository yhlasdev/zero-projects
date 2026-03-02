import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function JobSelect({
  value,
  onChange,
  onClear,
  placeholder,
  options,
  disabled,
  loading,
}) {
  const hasValue = value !== "" && value !== null && value !== undefined;

  return (
    <FormControl size="small" fullWidth variant="outlined">
      <Select
        value={value ?? ""}
        sx={{ borderRadius: 2.5 }}
        onChange={onChange}
        disabled={disabled || loading}
        label=''
        displayEmpty={!!placeholder}
        IconComponent={KeyboardArrowDownIcon}
        renderValue={(selectedId) => {
          if (!hasValue)
            return <span style={{ color: "#9e9e9e" }}>{placeholder}</span>;

          const selectedItem = options.find((opt) => opt.id === selectedId);
          return selectedItem ? selectedItem.title : selectedId;
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
      >
        {loading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : (
          options.map((job) => (
            <MenuItem key={job.id} value={job.id}>
              {job.title}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}

export default JobSelect;
