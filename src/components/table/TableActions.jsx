import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TableActions({ onView, onEdit, onDelete }) {
  return (
    <>
      <IconButton size="small" onClick={onView}>
        <VisibilityIcon fontSize="small" />
      </IconButton>
      {onEdit &&
        <IconButton size="small" onClick={onEdit}>
          <BorderColorIcon fontSize="small" />
        </IconButton>}
      {onDelete && (
        <IconButton size="small" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </>
  );
}
