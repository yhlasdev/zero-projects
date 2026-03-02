import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";

export default function TableActions({
  onView,
  onEdit,
  onDelete,
  onCalendar,
  onVisibility,
}) {
  return (
    <>
      {onVisibility && (
        <IconButton size="small" onClick={onView}>
          <VisibilityIcon  sx={{fontSize: 25}}/>
        </IconButton>
      )}
      {onCalendar && (
        <IconButton size="small" onClick={onCalendar} sx={{fontSize: 25}}>
          <CalendarMonthSharpIcon />
        </IconButton>
      )}
      {onEdit && (
        <IconButton size="small" onClick={onEdit}>
          <BorderColorIcon sx={{fontSize: '22px'}} />
        </IconButton>
      )}
      {onDelete && (
        <IconButton size="small" onClick={onDelete}>
          <DeleteForeverOutlinedIcon sx={{fontSize: 25}}/>
        </IconButton>
      )}
    </>
  );
}
